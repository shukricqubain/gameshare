import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RoleService } from 'src/app/services/roleID.service';
import { UserService } from 'src/app/services/user.service';
import { UsernameService } from 'src/app/services/username.service';
import { Location } from '@angular/common';
import { User } from 'src/app/models/user.model';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {


  signupForm = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    dateOfBirth: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
    userRole: new FormControl(''),
    password: new FormControl('', [Validators.required]),
  });
  showPassword: boolean = false;
  minDate: Date;
  emailValidation = '^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$';

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router,
    private usernameService: UsernameService,
    private roleService: RoleService,
    private location: Location,
  ){
  }

  ngOnInit(){
    let data: any = this.location.getState();
    this.signupForm.controls.userName.patchValue(data.userPass.userName);
    this.signupForm.controls.password.patchValue(data.userPass.password);
    this.setupMinDate();
  }

  onSubmit(){
    let newUser: User = {
      userName: '',
      firstName: '',
      lastName: '',
      userPassword: '',
      userRole: 0,
      email: '',
      dateOfBirth: '',
      userID: 0,
      profilePicture: ''
    };
    newUser.firstName = this.signupForm.controls.firstName.value || '';
    newUser.lastName = this.signupForm.controls.lastName.value || '';
    newUser.userName = this.signupForm.controls.userName.value || '';
    newUser.userPassword = this.signupForm.controls.password.value || '';
    newUser.userRole = Number(this.signupForm.controls.userRole.value) || 2;
    newUser.email = this.signupForm.controls.email.value || '';
    newUser.dateOfBirth = this.signupForm.controls.dateOfBirth.value || ''; 
    newUser.phoneNumber = this.signupForm.controls.phoneNumber.value || '';
    this.userService.create(newUser).subscribe({
      next: this.handleCreateResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

  handleCreateResponse(data:any){
    let userName = this.signupForm.controls.userName.value;
    let role = this.signupForm.controls.userRole.value;
    if(data.user_id !== null && data.created_user !== null && userName !== null && role !== null){
      localStorage.setItem('roleID', role);
      localStorage.setItem('userName', userName);
      this.usernameService.setUsernameObs(userName);
      this.roleService.setRoleObs(role);
      this.snackBar.open('Successfully signed up!', 'dismiss',{
        duration: 3000
      });
      this.router.navigate(['/home']);
    }
  }

  handleErrorResponse(error:any){
    this.snackBar.open(error.message, 'dismiss',{
      duration: 3000
    });
  }

  redirect(){
    this.router.navigate(['/']);
  }

  setupMinDate(){
    ///setup minimum date of birth for user to be 13
    let currentDate = new Date();
    let year = currentDate.getFullYear() - 13;
    let month = currentDate.getMonth() + 1;
    let day = currentDate.getDate();
    this.minDate = new Date(`${year}-${month}-${day}`);
  }
  
}
