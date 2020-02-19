import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { TensorflowComponent } from './components/tensorflow/tensorflow.component';
import { RoutingModule } from './routing.module';
import { HomeComponent } from './components/home/home.component';
import { SpeechRecognitionComponent } from './components/speech-recognition/speech-recognition.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ChatComponent } from './components/chat/chat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from './services/auth-guard.service';
import { AddChatComponent } from './components/add-chat/add-chat.component';
import { OnDestroyComponent } from './components/on-destroy/on-destroy.component';
import { ChatListComponent } from './components/chat-list/chat-list.component';
import { PathfindingVizualizerComponent } from './components/pathfinding-vizualizer/pathfinding-vizualizer.component';
import { CommonModule } from '@angular/common';
import { TicTacToeComponent } from './components/tic-tac-toe/tic-tac-toe.component';

@NgModule({
  declarations: [
    AppComponent,
    TensorflowComponent,
    HomeComponent,
    SpeechRecognitionComponent,
    AuthenticationComponent,
    ChatComponent,
    AddChatComponent,
    OnDestroyComponent,
    ChatListComponent,
    PathfindingVizualizerComponent,
    TicTacToeComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    RoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase, 'pwa'),
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthGuard,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [AddChatComponent]
})
export class AppModule { }
