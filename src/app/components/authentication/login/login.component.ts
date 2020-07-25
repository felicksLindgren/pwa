import { Component, OnInit } from '@angular/core';
import { OnDestroyComponent } from '../../on-destroy/on-destroy.component';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

const GOOGLE = 'Google';
const GITHUB = 'GitHub';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends OnDestroyComponent implements OnInit {
  returnUrl: string;

  constructor(
    public auth: AuthService,
    public route: ActivatedRoute,
    private router: Router
    ) {
    super();
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  signIn(provider: string): void {
    this.auth.signIn(provider).then(() =>
      this.router.navigateByUrl(
        this.returnUrl,
        { queryParams: {  returnUrl: null },
        queryParamsHandling: 'merge' }
      )
    );
  }
}
