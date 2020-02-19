import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { valueAndGrad } from '@tensorflow/tfjs';

const GRID_SIZE = 3;

export class Node {
  row: number;
  column: number;
  value = '';
}

@Injectable({
  providedIn: 'root'
})
export class TicTacToeService {

  constructor(private afs: AngularFirestore) { }

  getGrid(): Observable<Node[][]> {
    return this.afs.collection('tic-tac-toe').doc('grid-doc').snapshotChanges().pipe(map(snapshot => {
      const docs = [];

      const data = snapshot.payload.data() as any;

      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const element = data[key];
          docs.push(element);
        }
      }

      return docs;
    }));
  }

  getLastMove() {
    return this.afs.collection('tic-tac-toe').doc('lastMove').valueChanges().pipe(map(value => {
      return (value as any).value;
    }));
  }

  saveLastMove(value: string) {
    this.afs.collection('tic-tac-toe').doc('lastMove').update({ value });
  }

  saveGrid(grid: Node[][]) {
    this.afs.collection('tic-tac-toe').doc('grid-doc').update({ ...grid });
  }
}
