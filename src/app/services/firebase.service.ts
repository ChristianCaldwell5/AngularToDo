import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { SessionService } from '../services/session.service';

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {

    public hashedPass: string;
    
    constructor (
        public firestore: AngularFirestore,
        public sessionService: SessionService
    ) {}

    public checkUsernameAvailability(newUsername): Promise<boolean> {
        let available = false
        const usernameRef = this.firestore.collection('usernameLookup').doc(newUsername);
        
        return usernameRef.ref.get().then((docData) => {
            if (docData.exists) {
                available = false;
                console.log('username not available')
                return available
            } else {
                console.log('username available')
                available = true;
                return available
            }
        });
    }

    public async createUser(user) {
        const newDocInfo = await this.firestore.collection('users').add({
            username: user.username,
            password: user.password,
            email: user.email
        });
        let newUser = {
            username: user.username,
            id: newDocInfo.id
        }
        this.sessionService.setNewUserId(newUser.id);
        this.setUsernameLookup(newUser);
    }

    public getSecurePassword(user) {
        return this.firestore.collection('users', ref => ref.where('username', '==', user.username)).snapshotChanges();
    }

    public setUsernameLookup(user) {
        this.firestore.collection('usernameLookup').doc(user.username).set({
            UID: user.id
        })
    }

}