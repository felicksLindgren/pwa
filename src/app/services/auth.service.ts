import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { switchMap, first} from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { auth } from 'firebase';

interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  favoriteColor?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User>;
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.loading.next(true);
    this.user$ = this.afAuth.authState.pipe(switchMap(user => {
      const result = user ? this.afs.doc<User>(`users/${user.uid}`).valueChanges() : of(undefined);
      this.loading.next(false);
      return result;
    }));
  }

  getUser() {
    return this.user$.pipe(first()).toPromise();
  }

  googleSignIn(): Promise<void> {
    return this.oAuthLogin(new auth.GoogleAuthProvider());
  }

  gitHubSignIn(): Promise<void> {
    return this.oAuthLogin(new auth.GithubAuthProvider());
  }

  signOut() {
    this.afAuth.auth.signOut();
  }

  private async oAuthLogin(provider: firebase.auth.AuthProvider): Promise<void> {
    return this.afAuth.auth.signInWithPopup(provider).then(c => {
      this.updateUserData(c.user);
    });
  }

  private updateUserData(user: User): Promise<void> {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };

    return userRef.set(data, { merge: true });
  }
}
