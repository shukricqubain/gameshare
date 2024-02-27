import { Component, Inject, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserName } from 'src/app/models/userName.model';
import { UserChat } from 'src/app/models/userChat.model';
import { UserChatService } from 'src/app/services/userChat.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-add-user-chat',
  templateUrl: './add-user-chat.component.html',
  styleUrls: ['./add-user-chat.component.css']
})
export class AddUserChatComponent {

  constructor(
    private userChatService: UserChatService,
    private snackBar: MatSnackBar,
    private router: Router,
    @Optional() private dialogRef?: MatDialogRef<AddUserChatComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?:any
  ){}

  addUserChatForm = new FormGroup({
    userID: new FormControl('', [Validators.required]),
    createdAt: new FormControl(''),
    updatedAt: new FormControl('')
  });

  isEdit: boolean = false;
  allFriendNames: UserName[];
  currentUser: User;

  ngOnInit(){
    if(this.data){
      this.allFriendNames = this.data.friendNames;
      this.currentUser = this.data.currentUser;
    } else {
      this.snackBar.open(`Error! data came in undefined in add chat component.`, 'dismiss', {
        duration: 3000
      });
    }
  }

  onSubmit(){
    let newChat: UserChat = {
      userChatID: 0,
      userOneID: 0,
      userTwoID: 0,
      createdBy: 0,
      updatedBy: 0,
      createdAt: '',
      updatedAt: ''
    }

    if(this.addUserChatForm.controls.userID.value !== undefined && this.addUserChatForm.controls.userID.value !== null){

      newChat.userOneID = this.currentUser.userID;
      newChat.userTwoID = parseInt(this.addUserChatForm.controls.userID.value) || 0;
      newChat.createdBy = this.currentUser.userID;

    } else {
      this.snackBar.open(`Error! selected friend is undefined.`, 'dismiss', {
        duration: 3000
      });
    }
    newChat.createdAt = this.addUserChatForm.controls.createdAt.value || '';
    newChat.updatedAt = this.addUserChatForm.controls.updatedAt.value || '';

    if(this.isEdit){
      newChat.userChatID = this.data.element?.userChatID;
      this.userChatService.update(newChat).subscribe({
        next: this.handleEditResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    } else {
      this.userChatService.create(newChat).subscribe({
        next: this.handleCreateResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    }
  }

  handleCreateResponse(data:any){
    if(data !== null){
      this.snackBar.open('Successfully created a new user chat!', 'dismiss',{
        duration: 3000
      });
      this.closeDialog(data)
    }
  }

  handleEditResponse(data:any){
    if(data !== null && data !== undefined){

      if(this.data !== null){
        this.snackBar.open('Successfully edited a chat!', 'dismiss',{
          duration: 3000
        });
        this.closeDialog(data);
      } else {
        this.snackBar.open('Successfully edited a chat!', 'dismiss',{
          duration: 3000
        });
        this.router.navigate(['/user-profile']);
      }
      
    }
  }

  handleErrorResponse(error:any){
    this.snackBar.open(error.message, 'dismiss',{
      duration: 3000
    });
  }

  closeDialog(data?:any){
    if(data !== null && this.isEdit){
      this.dialogRef?.close({event: 'Edited Chat', data: data});
    } else if(data !== null && !this.isEdit){
      this.dialogRef?.close({event: 'Created Chat', data: data});
    } else {
      this.dialogRef?.close({event:'Cancel'});
    }
  }
}
