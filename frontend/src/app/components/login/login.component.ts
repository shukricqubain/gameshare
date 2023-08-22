import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UsernameService } from 'src/app/services/username.service';
import { RoleService } from 'src/app/services/roleID.service';

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
  unsubscribe$: Subject<boolean> = new Subject();

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router,
    private usernameService: UsernameService,
    private roleService: RoleService
  ) {
  }

  ngOnInit() {
    this.loginForm.controls.username.patchValue('');
    this.loginForm.controls.password.patchValue('');
  }

  async onSubmit() {
    await this.userService.login(this.loginForm.value).subscribe({
      next: this.handleLoginResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

  async onSignup(){
    console.log('signup')
    console.log(this.loginForm.value);
    if(this.loginForm.controls.username.value){
      let username: string = this.loginForm.controls.username.value;
      await this.userService.getUserByName(username).subscribe({
        next: this.handleGetUser.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    }
    
  }

  handleGetUser(data:any){
    console.log('got user')
    console.log(data)
  }

  handleLoginResponse(data: any) {
    if (data.message === 'Logged in successfully.') {
      this.snackBar.open(data.message, 'dismiss', {
        duration: 3000
      });
      this.usernameService.setUsernameObs(data.userName);
      this.roleService.setRoleObs(data.roleID);
      localStorage.setItem('userName', data.userName);
      localStorage.setItem('roleID', data.roleID);
      this.router.navigate(['/home']);
    } else if(data.message === 'Token deleted, reload login.') {
      localStorage.removeItem("userName"); 
      localStorage.removeItem("roleID");
      this.loginForm.controls.username.patchValue('');
      this.loginForm.controls.password.patchValue('');
      this.snackBar.open('Token expired. Please login again.', 'dismiss', {
        duration: 3000
      });
    } else {
      localStorage.removeItem("userName"); 
      localStorage.removeItem("roleID");
      this.loginForm.controls.username.patchValue('');
      this.loginForm.controls.password.patchValue('');
    }
  }

  handleErrorResponse(error: any) {
    if (error.error.message !== undefined) {
      this.snackBar.open(error.error.message, 'dismiss', {
        duration: 3000
      });
    } else {
      this.snackBar.open(error.message, 'dismiss', {
        duration: 3000
      });
    }
  }

}
