import { Component, Inject, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Thread } from 'src/app/models/thread.model';
import { ThreadItem } from 'src/app/models/threadItem.model';
import { ThreadItemService } from 'src/app/services/threadItem.service';
import { UserService } from 'src/app/services/user.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-add-thread-item',
  templateUrl: './add-thread-item.component.html',
  styleUrls: ['./add-thread-item.component.css']
})
export class AddThreadItemComponent {

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private threadItemService: ThreadItemService,
    private userService: UserService,
    @Optional() private dialogRef?: MatDialogRef<AddThreadItemComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }

  addThreadItemForm = new FormGroup({
    threadItemID: new FormControl(''),
    threadID: new FormControl('', [Validators.required]),
    threadMessage: new FormControl('', [Validators.required]),
    userID: new FormControl('', [Validators.required]),
    threadItemImage: new FormControl(''),
    replyID: new FormControl(''),
    createdAt: new FormControl(''),
    updatedAt: new FormControl('')
  });

  isEdit: boolean = false;
  userID: Number = 0;
  thread: Thread;
  threadItem: ThreadItem;
  assetLocation: string = 'thread-items';

  async ngOnInit() {

    if (this.data !== undefined && this.data.thread !== undefined) {

      if (this.data.isEdit !== undefined && this.data.isEdit == true) {
        this.isEdit = true;
        this.thread = this.data.thread;
        this.threadItem = this.data.threadItem;
        let threadItemID = `${this.threadItem.threadItemID}`;
        let threadID = `${this.thread.threadID}`;
        let threadMessage = `${this.threadItem.threadMessage}`;
        let userID = `${this.threadItem.userID}`;
        let threadItemImage = `${this.data.threadItem.threadItemImage}`;
        let createdAt = `${this.threadItem.createdAt}`;
        let updatedAt = `${this.threadItem.updatedAt}`;
        ///check if post is a reply
        if(this.data.replyID !== undefined){
          let replyID = `${this.data.replyID}`;
          this.addThreadItemForm.controls.replyID.patchValue(replyID);
        }
        this.addThreadItemForm.controls.threadItemID.patchValue(threadItemID);
        this.addThreadItemForm.controls.threadID.patchValue(threadID);
        this.addThreadItemForm.controls.threadMessage.patchValue(threadMessage);
        this.addThreadItemForm.controls.threadItemImage.patchValue(threadItemImage);
        this.addThreadItemForm.controls.userID.patchValue(userID);
        this.addThreadItemForm.controls.createdAt.patchValue(createdAt);
        this.addThreadItemForm.controls.updatedAt.patchValue(updatedAt);
      } else {
        this.thread = this.data.thread;
        let threadID = `${this.thread.threadID}`;
        let localUserName = localStorage.getItem('userName');
        ///grabbing userName to populate userID for threadItem
        if (localUserName !== undefined && localUserName !== null) {
          let user = await lastValueFrom(this.userService.getUserByName(localUserName).pipe());
          if (user !== undefined) {
            let userID = `${user.userID}`;
            this.addThreadItemForm.controls.userID.patchValue(userID);
          } else {
            this.snackBar.open(`Error fetching user data needed for posting or editing a post: user undefined.`, 'dismiss', {
              duration: 3000
            });
          }
        }
        this.addThreadItemForm.controls.threadID.patchValue(threadID);
        ///check if post is a reply
        if(this.data.replyID !== undefined){
          let replyID = `${this.data.replyID}`;
          this.addThreadItemForm.controls.replyID.patchValue(replyID);
        }
      }

    } else {
      this.snackBar.open(`Error fetching thread data needed for posting or editing a post: thread undefined.`, 'dismiss', {
        duration: 3000
      });
    }
  }

  onSubmit() {
    let threadItem: ThreadItem = {
      threadItemID: 0,
      threadID: 0,
      threadMessage: '',
      userID: 0,
      replyID: 0,
      threadItemImage: '',
      createdAt: '',
      updatedAt: ''
    }
    if (this.isEdit == true) {
      if (this.addThreadItemForm.controls.threadItemID.value !== null) {
        threadItem.threadItemID = parseInt(this.addThreadItemForm.controls.threadItemID.value);
      }
      if (this.addThreadItemForm.controls.threadID.value !== null) {
        threadItem.threadID = parseInt(this.addThreadItemForm.controls.threadID.value);
      }
      threadItem.threadMessage = this.addThreadItemForm.controls.threadMessage.value || '';
      if (this.addThreadItemForm.controls.userID.value !== null) {
        threadItem.userID = parseInt(this.addThreadItemForm.controls.userID.value);
      }
      if (this.addThreadItemForm.controls.replyID.value !== null) {
        threadItem.replyID = parseInt(this.addThreadItemForm.controls.replyID.value);
      }
      if (this.addThreadItemForm.controls.createdAt.value !== null) {
        threadItem.createdAt = this.addThreadItemForm.controls.createdAt.value;
      }
      if(this.addThreadItemForm.controls.threadItemImage.value !== null){
        threadItem.threadItemImage = this.addThreadItemForm.controls.threadItemImage.value;
      }
      this.threadItemService.update(threadItem).subscribe({
        next: this.handleUpdateResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    } else {
      if (this.addThreadItemForm.controls.threadID.value !== null) {
        threadItem.threadID = parseInt(this.addThreadItemForm.controls.threadID.value);
      }
      threadItem.threadMessage = this.addThreadItemForm.controls.threadMessage.value || '';
      if (this.addThreadItemForm.controls.userID.value !== null) {
        threadItem.userID = parseInt(this.addThreadItemForm.controls.userID.value);
      }
      if (this.addThreadItemForm.controls.replyID.value !== null) {
        threadItem.replyID = parseInt(this.addThreadItemForm.controls.replyID.value);
      }
      if(this.addThreadItemForm.controls.threadItemImage.value !== null){
        threadItem.threadItemImage = this.addThreadItemForm.controls.threadItemImage.value;
      }
      this.threadItemService.create(threadItem).subscribe({
        next: this.handleCreateResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    }
  }

  handleCreateResponse(data: any) {
    if (data !== null && data !== undefined) {
      this.snackBar.open('Successfully created a new thread item!', 'dismiss', {
        duration: 3000
      });
      this.closeDialog(data);
    }
  }

  handleUpdateResponse(data: any) {
    if (data !== null && data !== undefined) {
      this.snackBar.open('Successfully update a thread item!', 'dismiss', {
        duration: 3000
      });
      this.closeDialog(data);
    }
  }

  handleErrorResponse(error: any) {
    this.snackBar.open(error.message, 'dismiss', {
      duration: 3000
    });
  }

  closeDialog(data?: any) {
    if (data !== null) {
      if (this.isEdit) {
        this.dialogRef?.close({ event: 'Created Thread Item', data: data });
      } else {
        this.dialogRef?.close({ event: 'Edited Thread Item', data: data });
      }
    } else {
      this.dialogRef?.close({ event: 'Cancel' });
    }
  }

  loadImageEvent(imgCompressed: string){
    this.addThreadItemForm.controls.threadItemImage.patchValue(imgCompressed);
    this.addThreadItemForm.controls.threadItemImage.markAsDirty();
  }
}
