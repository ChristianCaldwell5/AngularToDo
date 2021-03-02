import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {
    
    constructor (
        public firestore: AngularFirestore
    ) {}

    public async checkUsernameAvailability(newUsername): Promise<boolean> {
        const usernameRef = this.firestore.collection('usernameLookup').doc(newUsername);
        const doc = await usernameRef.get();

        // if username is not found, return true
        if(!doc) {
            return true;
        } else {
            return false;
        }
    }

    public async createUser(user) {
        const newDocInfo = await this.firestore.collection('users').add({
            username: user.username,
            password: user.password,
            student: user.isStudent
        })
        let newUser = {
            username: user.username,
            id: newDocInfo.id
        }
        this.setUsernameLookup(newUser)
    }

    public setUsernameLookup(user) {
        return this.firestore.collection('usernameLookup').doc(user.username).set({
            UID: user.id
        })
    }

}