import { Component, Inject, Optional } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { ProfilePictureService } from 'src/app/services/profilePicture.service';

@Component({
  selector: 'app-profile-picture-pop-up',
  templateUrl: './profile-picture-pop-up.component.html',
  styleUrls: ['./profile-picture-pop-up.component.css']
})
export class ProfilePicturePopUpComponent {

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private profilePictureService: ProfilePictureService,
    @Optional() private dialogRef?: MatDialogRef<ProfilePicturePopUpComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any,
  ) {
  }

  isEdit: boolean = false;
  fileName: string;
  savingPicture: boolean = false;
  userProfileForm: any;

  profilePictureFileNameForm = new FormGroup({
    profilePictureFileName: new FormControl('')
  });

  ngAfterContentInit() {
    if(this.data != undefined && this.data.form != undefined){
      this.userProfileForm = this.data.form;
      let profilePictureFileName = this.userProfileForm.controls.profilePictureFileName.value;
      if(profilePictureFileName !== ''){
        this.isEdit = true;
      }
    }
  }

  removeProfilePicture(){
    this.profilePictureFileNameForm.controls.profilePictureFileName.patchValue('');
    this.profilePictureFileNameForm.controls.profilePictureFileName.markAsDirty();
  }

  async closeDialog(data?: any) {
    ///check if user submitted form or not
    if (data !== null && data !== undefined && data === 'confirm') {
      this.savingPicture = true;
      let updatedUser: User = {
        userName: '',
        firstName: '',
        lastName: '',
        userPassword: '',
        userRole: 0,
        email: '',
        dateOfBirth: '',
        userID: 0,
        profilePictureFileName: '',
        createdAt: '',
        updatedAt: ''
      };
      updatedUser.userID = this.userProfileForm.controls.userID.value || 0;
      updatedUser.firstName = this.userProfileForm.controls.firstName.value || '';
      updatedUser.lastName = this.userProfileForm.controls.lastName.value || '';
      updatedUser.userName = this.userProfileForm.controls.userName.value || '';
      updatedUser.userPassword = this.userProfileForm.controls.userPassword.value || '';
      updatedUser.userRole = Number(this.userProfileForm.controls.userRole.value) || 2;
      updatedUser.email = this.userProfileForm.controls.email.value || '';
      updatedUser.dateOfBirth = this.userProfileForm.controls.dateOfBirth.value || ''; 
      updatedUser.phoneNumber = this.userProfileForm.controls.phoneNumber.value || '';
      updatedUser.createdAt = this.userProfileForm.controls.createdAt.value || '';
      updatedUser.updatedAt = this.userProfileForm.controls.updatedAt.value || '';
      updatedUser.profilePictureFileName = this.profilePictureFileNameForm.controls.profilePictureFileName.value || '';
      await this.userService.update(updatedUser).subscribe({
        next: this.handleUpdateResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    } else {
      this.dialogRef?.close({ event: 'Cancel' });
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name.toLowerCase();
      const formData = new FormData();
      formData.append("fileName", file.name);
      formData.append("imageFile", file);
      let assetLocation = 'profile-pictures';
      let profilePictureFileName = `assets/${assetLocation}/${this.fileName}`;
      this.profilePictureFileNameForm.controls.profilePictureFileName.patchValue(profilePictureFileName);
      this.userService.uploadProfilePicture(assetLocation, formData).subscribe({
        next: this.handleUploadResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    }
  }

  handleUpdateResponse(data: any) {
    this.snackBar.open(data.message, 'dismiss', {
      duration: 2000
    });
    if(data.token !== 'no token update.'){
      localStorage.setItem('token', data.token);
    }
    let profilePictureFileName = this.profilePictureFileNameForm.controls.profilePictureFileName.value ? this.profilePictureFileNameForm.controls.profilePictureFileName.value : '';
    this.profilePictureService.setProfilePictureObs(profilePictureFileName);
    this.dialogRef?.close({ event: 'Update profile picture.'});
  }

  handleErrorResponse(data: any) {
    this.snackBar.open(data.message, 'dismiss', {
      duration: 2000
    });
  }

  handleUploadResponse(data: any){
    if(data){
      this.snackBar.open('Successfully uploaded profile picture!', 'dismiss', {
        duration: 3000
      });
      this.profilePictureFileNameForm.controls.profilePictureFileName.markAsDirty();
    } else {
      this.snackBar.open('Error occurred uploading profile picture!', 'dismiss', {
        duration: 3000
      });
    }
  }
}
