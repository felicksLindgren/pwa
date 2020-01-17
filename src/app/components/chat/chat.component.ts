import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @ViewChild('content', { static: true }) private content: ElementRef;
  chat$: Observable<any>;
  maxLength = 150;
  form: FormGroup;

  constructor(
    public chatService: ChatService,
    private route: ActivatedRoute,
    public auth: AuthService
  ) {
    this.form = new FormGroup({
      message: new FormControl(null, {validators: [Validators.maxLength(this.maxLength)]})
    });
  }

  get message() { return this.form.get('message'); }

  ngOnInit() {
    const source = this.route.paramMap.pipe(switchMap(r => {
      return this.chatService.get(r.get('id'));
    }));

    this.chat$ = this.chatService.joinUsers(source).pipe(
      tap(c => {
        if (this.content && c) {
          setTimeout(this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight, 1e3);
        }
      })
    );
  }

  async submit(id: string) {
    if (this.message.value) {
      await this.chatService.sendMessage(id, this.message.value);
      this.message.reset(null);
    }
  }

  trackByCreated(i: number, msg: any) {
    return msg.createdAt;
  }
}
