import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm = new FormGroup({
    username: new FormControl('',
      [Validators.required]),
    password: new FormControl('',
      [Validators.required])
  });
  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ){
  }

  ngOnInit(){

  }

  async onSubmit(){
    this.userService.login(this.loginForm.value).subscribe(res => {
      console.log(res);
      if (res.message === 'Logged in successfully.') {
        this.snackBar.open(res.message, 'dismiss');
        this.router.navigate(['/home']);

      } else {
        this.snackBar.open(res.message, 'dismiss');
      }
    });
  }
}
