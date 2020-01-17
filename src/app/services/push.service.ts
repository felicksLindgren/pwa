import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { PushNotification } from '../interfaces/push-notification';
import { Observable } from 'rxjs';

const VAPID_KEY = {
  publicKey: 'BDIvhFriqILfjbe307SKgaBAN38krwmkyNUHMPxwGLlP9DMgC3UeoYXTG8aPXpumYqG9_zuMxlOchWwIAINH43E',
  privateKey: 'sAmO9U8IvQyTZJkKOygI5rC3E_1W0vUgVvCPucEOTzg'
};

@Injectable({
  providedIn: 'root'
})
export class PushService {
  subscriptions: PushSubscription[] = [];

  constructor(private swPush: SwPush) {}

  request() {
    this.swPush.requestSubscription({ serverPublicKey: VAPID_KEY.publicKey })
      .then(subscription => {
        this.subscriptions.push(subscription);
        console.log('Request succeeded: ', subscription);
      }).catch(error => console.log(error));
  }

  create(title: string, options?: PushNotification): Observable<any> {
    return new Observable((obs: any) => {
      const n = new Notification(title, options);

      n.onshow = (e: any) => obs.next({notification: n, event: e});
      n.onclick = (e: any) => obs.next({notification: n, event: e});
      n.onerror = (e: any) => obs.error({notification: n, event: e});
      n.onclose = () => obs.complete();
    });
  }

}
