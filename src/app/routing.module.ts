import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TensorflowComponent } from './components/tensorflow/tensorflow.component';
import { HomeComponent } from './components/home/home.component';
import { SpeechRecognitionComponent } from './components/speech-recognition/speech-recognition.component';
import { ChatComponent } from './components/chats/chat/chat.component';
import { AuthGuard } from './services/auth-guard.service';
import { PathfindingVizualizerComponent } from './components/pathfinding-vizualizer/pathfinding-vizualizer.component';
import { TicTacToeComponent } from './components/tic-tac-toe/tic-tac-toe.component';
import { SortingVizualizerComponent } from './components/sorting-vizualizer/sorting-vizualizer.component';
import { GravityComponent } from './components/gravity/gravity.component';
import { ChatsComponent } from './components/chats/chats.component';
import { LoginComponent } from './components/authentication/login/login.component';

const routes: Routes = [
  { path: '', component: HomeComponent, data: { title: '' } },
  { path: 'login', component: LoginComponent, data: { title: 'Login' }},
  { path: 'tensorflow', component: TensorflowComponent, data: { title: 'Image classifier' } },
  { path: 'speech', component: SpeechRecognitionComponent, data: { title: 'Speech recognition' } },
  { path: 'chats', component: ChatsComponent, canActivate: [AuthGuard], data: { title: 'Chats' } },
  { path: 'chat/:id', component: ChatComponent, canActivate: [AuthGuard], data: { title: 'Chat' } },
  { path: 'pathfinding-vizualizer', component: PathfindingVizualizerComponent, data: { title: 'Pathfinding Vizualizer' } },
  { path: 'sorting-vizualizer', component: SortingVizualizerComponent, data: { title: 'Sorting Vizualizer' } },
  { path: 'tic-tac-toe', component: TicTacToeComponent, canActivate: [AuthGuard], data: { title: 'Tic Tac Toe' } },
  { path: 'gravity', component: GravityComponent, data: { title: 'Bouncing ball' } }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { enableTracing: false })
  ],
  exports: [
    RouterModule
  ],
})
export class RoutingModule { }
