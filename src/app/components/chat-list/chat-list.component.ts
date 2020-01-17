import { Component, OnInit, Input } from '@angular/core';
import { User } from 'firebase';
import { Observable } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';
import { AddChatComponent } from '../add-chat/add-chat.component';
import { MatDialog } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { OnDestroyComponent } from '../on-destroy/on-destroy.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent extends OnDestroyComponent implements OnInit {
  @Input() user: User;
  chats$: Observable<any>;

  constructor(
    private chatService: ChatService,
    private dialog: MatDialog,
    private auth: AuthService
  ) {
    super();
  }

  ngOnInit() {
    this.chats$ = this.chatService.getAll();
  }

  addChat() {
    this.dialog.open(AddChatComponent).afterClosed().pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.chatService.create(value);
    });
  }

  async delete(id: string) {
    if (id) {
      await this.chatService.delete(id);
    }
  }

  signOut = () => this.auth.signOut();

}
