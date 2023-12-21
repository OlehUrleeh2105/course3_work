import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../shared/interfaces';
import { AuthService } from '../admin/shared/services/auth.service';

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.scss']
})
export class LoginUserComponent implements OnInit {

  form!: FormGroup;
  submitted = false;

  constructor(
    public auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ])
    })

    if (this.auth.isAuthenticated()) {
      this.router.navigate(['main']);
    }
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    const viewer: User = {
      email: this.form.value.email,
      password: this.form.value.password
    }

    this.auth.login(viewer, false)?.subscribe(() => {
      this.form.reset();
      this.router.navigate(['main']);
      this.submitted = false;
    }, () => {
      this.submitted = false;
    })
  }

}
