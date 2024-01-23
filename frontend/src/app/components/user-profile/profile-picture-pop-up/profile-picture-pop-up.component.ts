import { Component, Inject, Optional } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-picture-pop-up',
  templateUrl: './profile-picture-pop-up.component.html',
  styleUrls: ['./profile-picture-pop-up.component.css']
})
export class ProfilePicturePopUpComponent {

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    @Optional() private dialogRef?: MatDialogRef<ProfilePicturePopUpComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any,
  ) {
  }

  isEdit: boolean = false;
  fileName: string;
  savingPicture: boolean = false;
  userProfileForm: any;

  profilePictureForm = new FormGroup({
    profilePicture: new FormControl('')
  });

  ngAfterContentInit() {
    console.log(this.data)
    if(this.data != undefined && this.data.form != undefined){
      this.userProfileForm = this.data.form;
    }
    this.userProfileForm
  }

  async closeDialog(data?: any) {
    ///check if user submitted form or not
    if (data !== null && data !== undefined && data === 'confirm') {
      this.savingPicture = true;
      console.log(this.userProfileForm)
      let updatedUser: User = {
        userName: '',
        firstName: '',
        lastName: '',
        userPassword: '',
        userRole: 0,
        email: '',
        dateOfBirth: '',
        userID: 0,
        profilePicture: '',
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
      console.log(updatedUser)
      updatedUser.profilePicture = this.profilePictureForm.controls.profilePicture.value || '';
      await this.userService.update(updatedUser).subscribe({
        next: this.handleUpdateResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });


      this.dialogRef?.close({ event: 'Update profile picture.'});
    } else {
      this.dialogRef?.close({ event: 'Cancel' });
    }
  }

  async onFileSelected(event: any){
    const file = event.target.files[0] ?? null;
    this.fileName = file.name;
    let reader = new FileReader();
    reader.onloadend = function() {
      //console.log('RESULT', reader.result)
    }
    
    if(file){
      let imgCompressed = await this.compressImage(file, 50);
      imgCompressed = 'data:image/png;base64,' + imgCompressed.split(',')[1];
      this.profilePictureForm.controls.profilePicture.patchValue(imgCompressed);
      this.profilePictureForm.controls.profilePicture.markAsDirty();
    }
  }

  async compressImage(blobImg: any, percent: any){
    let bitmap = await createImageBitmap(blobImg);
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext('2d');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    ctx?.drawImage(bitmap, 0, 0);
    let dataURL = canvas.toDataURL("images/png", percent / 100);
    return dataURL;
  }

  handleUpdateResponse(data: any) {
    console.log(data)
    this.snackBar.open(data.message, 'dismiss', {
      duration: 2000
    });
  }

  handleErrorResponse(data: any) {
    console.log(data)
    this.snackBar.open(data.message, 'dismiss', {
      duration: 2000
    });
  }
}
