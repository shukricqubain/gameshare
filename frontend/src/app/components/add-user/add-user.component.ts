import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {

  addUserForm = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    dateOfBirth: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
    userRole: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
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
    let newUser: User = {
      userName: '',
      firstName: '',
      lastName: '',
      password: '',
      userRole: 0,
      email: '',
      dateOfBirth: ''
    };
    newUser.firstName = this.addUserForm.controls.firstName.value || '';
    newUser.lastName = this.addUserForm.controls.lastName.value || '';
    newUser.userName = this.addUserForm.controls.userName.value || '';
    newUser.password = this.addUserForm.controls.password.value || '';
    newUser.userRole = Number(this.addUserForm.controls.firstName.value) || 2;
    newUser.email = this.addUserForm.controls.email.value || '';
    newUser.dateOfBirth = this.addUserForm.controls.dateOfBirth.value || ''; 
    newUser.phoneNumber = this.addUserForm.controls.phoneNumber.value || '';
    this.userService.create(newUser).subscribe({
      next: this.handleCreateResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

  handleCreateResponse(data:any){
    if(data.user_id !== null && data.created_user !== null){
      this.snackBar.open('Successfully created a new user!', 'dismiss',{
        duration: 3000
      });
      this.router.navigate(['/all-users']);
    }
  }

  handleErrorResponse(error:any){
    this.snackBar.open(error.message, 'dismiss',{
      duration: 3000
    });
  }

}
