import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { MatSnackBar } from "@angular/material/snack-bar";
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {

  constructor(
    private location: Location,
    private snackBar: MatSnackBar,
    private userService: UserService
  ) {
  }

  user: User;
  userProfileForm = new FormGroup({
    userID: new FormControl('', [Validators.required]),
    userName: new FormControl('', [Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    dateOfBirth: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
    userRole: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  showPassword: boolean = false;
  editEnabled: boolean = false;
  enableMessage: string = `Enable the form for updation.`

  ngOnInit() {
    let data: any = this.location.getState();
    this.user = data['user'];
    if (this.user !== null) {
      this.userProfileForm.controls.userID.setValue(this.user.userID ? `${this.user.userID}` : '');
      this.userProfileForm.controls.userName.setValue(this.user.userName ? this.user.userName : '');
      this.userProfileForm.controls.firstName.setValue(this.user.firstName ? this.user.firstName : '');
      this.userProfileForm.controls.lastName.setValue(this.user.lastName ? this.user.lastName : '');
      this.userProfileForm.controls.dateOfBirth.setValue(this.user.dateOfBirth ? this.user.dateOfBirth: '');
      this.userProfileForm.controls.email.setValue(this.user.email ? this.user.email: '');
      this.userProfileForm.controls.phoneNumber.setValue(this.user.phoneNumber ? this.user.phoneNumber: '');
      this.userProfileForm.controls.userRole.setValue(this.user.userRole ? `${this.user.userRole}` : '');
      this.userProfileForm.controls.password.setValue(this.user.password ? this.user.password: '');
      this.changeForm();
    } else {
      this.snackBar.open('An error occured while trying to load user profile with id of ``', 'dismiss',{
        duration: 3000
      });
    }
  }

  async onSubmit(){
    await this.userService.update(this.userProfileForm.value).subscribe({
      next: this.handleUpdateResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

  handleUpdateResponse(data:any){
    this.snackBar.open(data.message, 'dismiss',{
      duration: 2000
    });
    this.editEnabled = false;
    this.changeForm();
  }

  handleErrorResponse(data:any){
    this.snackBar.open(data.message, 'dismiss',{
      duration: 2000
    });
  }

  changeForm(){
    if(this.editEnabled){
      this.enableMessage = `Disable the form for updation.`;
      this.userProfileForm.controls.userID.enable();
      this.userProfileForm.controls.userName.enable();
      this.userProfileForm.controls.firstName.enable();
      this.userProfileForm.controls.lastName.enable();
      this.userProfileForm.controls.dateOfBirth.enable();
      this.userProfileForm.controls.email.enable();
      this.userProfileForm.controls.phoneNumber.enable();
      this.userProfileForm.controls.userRole.enable();
      this.userProfileForm.controls.password.enable();
    } else {
      this.enableMessage = `Enable the form for updation.`;
      this.userProfileForm.controls.userID.disable();
      this.userProfileForm.controls.userName.disable();
      this.userProfileForm.controls.firstName.disable();
      this.userProfileForm.controls.lastName.disable();
      this.userProfileForm.controls.dateOfBirth.disable();
      this.userProfileForm.controls.email.disable();
      this.userProfileForm.controls.phoneNumber.disable();
      this.userProfileForm.controls.userRole.disable();
      this.userProfileForm.controls.password.disable();
    }
  }
}
