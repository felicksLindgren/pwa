import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { firestore } from 'firebase';
import { Observable, combineLatest, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private router: Router
  ) {
  }

  getAll() {
    return this.afs.collection<any>('chats').snapshotChanges().pipe(map(snapshot => {
      const docs = [];
      snapshot.forEach(s => {
        docs.push({ id: s.payload.doc.id, ...s.payload.doc.data() });
      });

      return docs;
    }));
  }

  get(id: string) {
    return this.afs.collection<any>('chats').doc(id).snapshotChanges().pipe(map(doc => {
      return { id: doc.payload.id, ...doc.payload.data() as any };
    }));
  }

  async delete(id: string) {
    return this.afs.collection('chats').doc(id).delete();
  }

  async create(name: string) {
    const { uid } = await this.auth.getUser();

    const data = {
      uid,
      name,
      createdAt: Date.now(),
      count: 0,
      messages: []
    };

    const docRef = await this.afs.collection('chats').add(data);

    return this.router.navigate(['chat', docRef.id]);
  }

  async sendMessage(id: string, message: string) {
    const { uid } = await this.auth.getUser();

    const data = {
      uid,
      message,
      createdAt: Date.now()
    };

    if (uid) {
      const ref = this.afs.collection('chats').doc(id);
      return ref.update({
        messages: firestore.FieldValue.arrayUnion(data)
      });
    }
  }

  joinUsers(chat$: Observable<any>) {
    let chat;
    const joinKeys = {};

    return chat$.pipe(
      switchMap(c => {
        // Unique User IDs
        chat = c;
        const uids = Array.from(new Set(c.messages.map(v => v.uid)));

        // Firestore User Doc Reads
        const userDocs = uids.map(u =>
          this.afs.doc(`users/${u}`).valueChanges()
        );

        return userDocs.length ? combineLatest(userDocs) : of([]);
      }),
      map(arr => {
        arr.forEach(v => (joinKeys[v.uid] = v));
        chat.messages = chat.messages.map(v => {
          return { ...v, user: joinKeys[v.uid] };
        });

        return chat;
      })
    );
  }
}
