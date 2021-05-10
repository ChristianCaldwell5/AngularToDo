import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as bcrypt from 'bcryptjs';

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {

    public hashedPass: string;
    
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

    // public loginAttempt(user): boolean {
    //     let pass = this.firestore.collection('users', ref => ref.where('username', '==', user.username)).snapshotChanges();
    //     pass.subscribe(result => {
    //         console.log(result)
    //     })
    //     if (bcrypt.compareSync(user.password, pass)) {
    //         console.log('MATCHING');
    //         return true;
    //     } else {
    //         console.log('DENIED');
    //         return false;
    //     }
    //     let verified = false;
    //     const userDocRef = this.firestore.collection('users').ref;
    //     if (userDocRef) {
    //         userDocRef.where('username', '==', user.username)
    //             .get()
    //             .then(function(quertSnapshot) {
    //                 quertSnapshot.forEach(function(doc) {
    //                     const docInfo = doc.data() as any;
    //                     const docPassword = docInfo.password;
    //                     if (bcrypt.compareSync(user.password, docPassword)) {
    //                         console.log('MATCHING');
    //                         verified = true;
    //                         return true;
    //                     } else {
    //                         console.log('DENIED');
    //                         verified = false;
    //                         return false;
    //                     }
    //                 });
    //             });
    //     }
    //     console.log(verified);
    //     return verified;
    // }

    public getSecurePassword(user) {
        return this.firestore.collection('users', ref => ref.where('username', '==', user.username)).snapshotChanges();
    }

    public setUsernameLookup(user) {
        this.firestore.collection('usernameLookup').doc(user.username).set({
            UID: user.id
        })
    }

}