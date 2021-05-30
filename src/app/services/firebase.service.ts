import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import firebase from 'firebase/app';
import { SessionService } from '../services/session.service';
import { ListService } from '../services/list.service';

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {

    public hashedPass: string;
    
    constructor (
        public firestore: AngularFirestore,
        public listService: ListService,
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
                    "items": []
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
                    "items": []
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
        console.log(user);
        for (let i = 0; i < user.lists.length; i++) {
            if (user.lists[i].name === listName) {
                return false;
            }
        }
        let item = {
            "name": listName,
            "active": false,
            "items": []
        }
        this.listService.setSelectedList(item);
        this.sessionService.updateList(item);
        let docRef = this.firestore.collection('users').doc(user.id);
        docRef.update({
            lists: firebase.firestore.FieldValue.arrayUnion(item)
        });
        return true;
    }

}