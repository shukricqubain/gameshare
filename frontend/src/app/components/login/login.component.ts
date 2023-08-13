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
  }

  async onSubmit() {
    this.userService.login(this.loginForm.value).subscribe({
      next: this.handleLoginResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
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
