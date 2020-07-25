import { Component, OnInit } from '@angular/core';
import { OnDestroyComponent } from '../../on-destroy/on-destroy.component';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent extends OnDestroyComponent implements OnInit {

  constructor(
    public auth: AuthService,
    public route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
  }

}
