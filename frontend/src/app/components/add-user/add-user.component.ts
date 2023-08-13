import { Component, Inject, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsernameService } from 'src/app/services/username.service';
import { RoleService } from 'src/app/services/roleID.service';

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
    private router: Router,
    private usernameService: UsernameService,
    private roleService: RoleService,
    @Optional() private dialogRef?: MatDialogRef<AddUserComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: User
  ){
  }

  isEdit: boolean = false;
  showPassword: boolean = false;
  
  ngOnInit(){
    if(this.data !== null && this.data != undefined){
      this.isEdit = true;
      let dateOfBirth = `${this.data.dateOfBirth}`;
      let userName = `${this.data.userName}`;
      let firstName = `${this.data.firstName}`;
      let lastName = `${this.data.lastName}`;
      let email = `${this.data.email}`;
      let phoneNumber = `${this.data.phoneNumber}`;
      let userRole = `${this.data.userRole}`;
      let password = `${this.data.password}`;
      this.addUserForm.controls.dateOfBirth.patchValue(dateOfBirth);
      this.addUserForm.controls.userName.patchValue(userName);
      this.addUserForm.controls.firstName.patchValue(firstName);
      this.addUserForm.controls.lastName.patchValue(lastName);
      this.addUserForm.controls.email.patchValue(email);
      this.addUserForm.controls.phoneNumber.patchValue(phoneNumber);
      this.addUserForm.controls.userRole.patchValue(userRole);
      this.addUserForm.controls.password.patchValue(password);


    }
  }
  
  async onSubmit(){
    let newUser: User = {
      userName: '',
      firstName: '',
      lastName: '',
      password: '',
      userRole: 0,
      email: '',
      dateOfBirth: '',
      userID: 0
    };
    newUser.firstName = this.addUserForm.controls.firstName.value || '';
    newUser.lastName = this.addUserForm.controls.lastName.value || '';
    newUser.userName = this.addUserForm.controls.userName.value || '';
    newUser.password = this.addUserForm.controls.password.value || '';
    newUser.userRole = Number(this.addUserForm.controls.userRole.value) || 2;
    newUser.email = this.addUserForm.controls.email.value || '';
    newUser.dateOfBirth = this.addUserForm.controls.dateOfBirth.value || ''; 
    newUser.phoneNumber = this.addUserForm.controls.phoneNumber.value || '';
    if(this.isEdit){
      let initial_username = newUser.userName;
      let updated_username = this.addUserForm.controls.userName.value;
      let initial_role = localStorage.getItem('roleID');
      let updated_role = this.addUserForm.controls.userRole.value;
      if(initial_username !== null && updated_username !== null && initial_username !== updated_username){
        this.usernameService.setUsernameObs(updated_username);
      }
      if(initial_role !== null && updated_role !== null && initial_role !== updated_role){
        this.roleService.setRoleObs(updated_role);
        localStorage.setItem('roleID', updated_role);
      }
      newUser.userID = this.data?.userID;
      this.userService.update(newUser).subscribe({
        next: this.handleEditResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    } else {
      this.userService.create(newUser).subscribe({
        next: this.handleCreateResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    }
    
  }

  handleEditResponse(data:any){
    if(data.user_id !== null && data.created_user !== null){
      this.snackBar.open('Successfully edited a user!', 'dismiss',{
        duration: 3000
      });
      this.closeDialog(data)
    }
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

  editUser(){
    this.dialogRef?.close({
      data:this.data
    });
  }

  closeDialog(data?:any){
    if(data !== null){
      this.dialogRef?.close({event: 'Edited User', data: data});
    } else {
      this.dialogRef?.close({event:'Cancel'});
    }
  }

}
