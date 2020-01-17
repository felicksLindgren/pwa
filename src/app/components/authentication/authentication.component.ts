import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { OnDestroyComponent } from '../on-destroy/on-destroy.component';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent extends OnDestroyComponent implements OnInit {
  constructor(
    public auth: AuthService,
  ) {
    super();
  }

  ngOnInit() {
  }


}
