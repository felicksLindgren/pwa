import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TensorflowComponent } from './components/tensorflow/tensorflow.component';
import { HomeComponent } from './components/home/home.component';
import { SpeechRecognitionComponent } from './components/speech-recognition/speech-recognition.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { ChatComponent } from './components/chat/chat.component';
import { AuthGuard } from './services/auth-guard.service';
import { PathfindingVizualizerComponent } from './components/pathfinding-vizualizer/pathfinding-vizualizer.component';

const routes: Routes = [
  { path: '', component: HomeComponent, data: { title: '' } },
  { path: 'tensorflow', component: TensorflowComponent, data: { title: 'Image classifier' } },
  { path: 'speech', component: SpeechRecognitionComponent, data: { title: 'Speech recognition' } },
  { path: 'auth', component: AuthenticationComponent, data: { title: 'Chats' } },
  { path: 'chat/:id', component: ChatComponent, canActivate: [AuthGuard], data: { title: 'Chat' } },
  { path: 'pathfinding-vizualizer', component: PathfindingVizualizerComponent, data: { title: 'Pathfinding Vizualizer' } }
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
