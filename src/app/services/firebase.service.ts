import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {
    
    constructor (
        public firestore: AngularFirestore
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
            student: user.isStudent
        });
        let newUser = {
            username: user.username,
            id: newDocInfo.id
        }
        this.setUsernameLookup(newUser)
    }

    public setUsernameLookup(user) {
        this.firestore.collection('usernameLookup').doc(user.username).set({
            UID: user.id
        })
    }

}