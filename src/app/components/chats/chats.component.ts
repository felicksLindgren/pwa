import { Component, OnInit } from '@angular/core';
import { OnDestroyComponent } from '../on-destroy/on-destroy.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent extends OnDestroyComponent implements OnInit {

  constructor(public auth: AuthService) {
    super();
  }

  ngOnInit(): void {
  }

}
