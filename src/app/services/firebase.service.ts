import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import firebase from 'firebase/app';
import { SessionService } from '../services/session.service';

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {
    
    constructor (
        public firestore: AngularFirestore,
        public sessionService: SessionService
    ) {}

    public async checkUsernameAvailability(newUsername) {
        let available = false;
        const usernameRef = this.firestore.collection('usernameLookup').doc(newUsername);
        
        return await usernameRef.ref.get().then((docData) => {
            if (docData.exists) {
                available = false;
                console.log('username not available')
                return available;
            } else {
                console.log('username available')
                available = true;
                return available;
            }
        });
    }

    public async createUser(user) {
        const newDocInfo = await this.firestore.collection('users').add({
            username: user.username,
            password: user.password,
            email: user.email,
            lists: [
                {
                    "name": "24/7 List",
                    "active": false,
                    "items": [],
                    "recentlyCompleted": []
                }
            ]
        });
        let newUser = {
            username: user.username,
            id: newDocInfo.id,
            lists: [
                {
                    "name": "24/7 List",
                    "active": false,
                    "items": [],
                    "recentlyCompleted": []
                }
            ]
        }
        this.sessionService.setUser(newUser);
        this.setUsernameLookup(newUser);
    }

    public getUserInfo(user) {
        return this.firestore.collection('users', ref => ref.where('username', '==', user.username)).snapshotChanges();
    }

    public setUsernameLookup(user) {
        this.firestore.collection('usernameLookup').doc(user.username).set({
            UID: user.id
        })
    }

    public addList(user, listName: string): boolean {
        for (let i = 0; i < user.lists.length; i++) {
            if (user.lists[i].name === listName) {
                return false;
            }
        }
        let item = {
            "name": listName,
            "active": false,
            "items": [],
            "recentlyCompleted": []
        }
        this.sessionService.updateLists(item);
        this.sessionService.setSelectedList(item);
        this.sessionService.setSelectedIndex(user.lists.length-1);
        const docRef = this.firestore.collection('users').doc(user.id);
        docRef.update({
            lists: firebase.firestore.FieldValue.arrayUnion(item)
        });
        return true;
    }

    public deleteList(user): boolean {

        const docRef = this.firestore.collection('users').doc(user.id);
        docRef.update({
            lists: firebase.firestore.FieldValue.arrayRemove(user.selectedList)
        });

        return true;
    }

    public addItem(user, item: object) {
        let docRef = this.firestore.collection('users').doc(user.id);
        this.firestore.collection('users').doc(user.id).get().subscribe(res => {
            let localLists = res.get('lists');
            localLists[this.sessionService.getSelectedIndex()].items = localLists[this.sessionService.getSelectedIndex()].items.concat(item);
            docRef.update({
                lists: localLists
            });
            this.sessionService.updateSeledtedList(localLists, this.sessionService.getSelectedIndex());
        });
    }

    public deleteItem(user, itemToDelete): boolean {
        const docRef = this.firestore.collection('users').doc(user.id);
        this.firestore.collection('users').doc(user.id).get().subscribe(res => {
            let localLists = res.get('lists');
            let recentlyCompleted = localLists[this.sessionService.getSelectedIndex()].recentlyCompleted;
            if (recentlyCompleted.length >= 5) {
                recentlyCompleted.pop();
            }
            recentlyCompleted.unshift(itemToDelete);
            localLists[this.sessionService.getSelectedIndex()].items = localLists[this.sessionService.getSelectedIndex()].items.filter(item => item.name !== itemToDelete.name);
            docRef.update({
                lists: localLists,
                recentlyCompleted: recentlyCompleted
            });
            this.sessionService.updateSeledtedList(localLists, this.sessionService.getSelectedIndex());
        });
        return true;
    }

}