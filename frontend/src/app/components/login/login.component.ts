import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from "@angular/material/snack-bar";

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
    private snackBar: MatSnackBar
  ){
  }

  ngOnInit(){

  }

  async onSubmit(){
    console.log(this.loginForm.value)
    let result = this.userService.login(this.loginForm.value).subscribe(res => {
      console.log(res);
      if (res.message === 'Logged in successfully.') {
        this.snackBar.open(res.message, 'dismiss');
      }
    });
  }
}
