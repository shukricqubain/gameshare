import { Component, Inject, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ThreadName } from 'src/app/models/threadName.model';
import { UserThread } from 'src/app/models/userThread.model';
import { ThreadService } from 'src/app/services/thread.service';
import { UserThreadService } from 'src/app/services/userThread.service';

@Component({
  selector: 'app-add-user-thread',
  templateUrl: './add-user-thread.component.html',
  styleUrls: ['./add-user-thread.component.css']
})
export class AddUserThreadComponent {

  constructor(
    private threadService: ThreadService,
    private userThreadService: UserThreadService,
    private snackBar: MatSnackBar,
    private router: Router,
    @Optional() private dialogRef?: MatDialogRef<AddUserThreadComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }

  addUserThreadForm = new FormGroup({
    threadID: new FormControl('', [Validators.required]),
    createdAt: new FormControl(''),
    updatedAt: new FormControl('')
  });

  isEdit: boolean = false;
  allThreadNames: ThreadName[];

  async ngOnInit() {
    if(this.data !== null && this.data !== undefined && this.data.allThreads !== null && this.data.allThreads !== undefined){
      this.allThreadNames = this.data.allThreadNames;
    } else {
      await this.loadAllThreads();
    }
    if(this.data !== null && this.data != undefined && this.data.isEdit == true){
      this.isEdit = true;
      let threadName = `${this.data.element.threadName}`;
      let createdAt = `${this.data.element.createdAt}`;
      let updatedAt = `${this.data.element.updatedAt}`;
      this.addUserThreadForm.controls.threadID.patchValue(threadName);
      this.addUserThreadForm.controls.createdAt.patchValue(createdAt);
      this.addUserThreadForm.controls.updatedAt.patchValue(updatedAt);
    }
  }

  async onSubmit(){
    let newUserThread: UserThread = {
      userThreadID: 0,
      boardName: '',
      boardID: 0,
      userID: 0,
      threadID: 0,
      threadName: '',
      createdAt: '',
      updatedAt: ''
    };
    if(this.addUserThreadForm.controls.threadID.value !== undefined && this.addUserThreadForm.controls.threadID.value !== null){

      ///set threadID
      newUserThread.threadID = parseInt(this.addUserThreadForm.controls.threadID.value) || 0;
      ///set threadName
      let threadName = this.allThreadNames.find(obj => obj.threadID == newUserThread.threadID)?.threadName;
      if(threadName !== undefined){
        newUserThread.threadName = threadName;
      } else {
        this.snackBar.open(`Error! Can't find thread name based on selected threadID.`, 'dismiss', {
          duration: 3000
        });
      }

      ///grab boardID and boardName based on threadID
      let thread: any = await this.getSingleThread(newUserThread.threadID);
      if(thread != undefined && thread != null && thread !== `Can't find thread based on threadID`){
        newUserThread.boardID = parseInt(thread.boardID);
        newUserThread.boardName = thread.boardName;
      } else {
        this.snackBar.open('Error finding thread based on threadID', 'dismiss', {
          duration: 3000
        });
      }

    } else {
      this.snackBar.open(`Error! selected threadID is undefined.`, 'dismiss', {
        duration: 3000
      });
    }
    newUserThread.createdAt = this.addUserThreadForm.controls.createdAt.value || '';
    newUserThread.updatedAt = this.addUserThreadForm.controls.updatedAt.value || '';
    newUserThread.userID = this.data.userID || 0;

    if(this.isEdit){
      newUserThread.userThreadID = this.data.element?.userThreadID;
      this.userThreadService.update(newUserThread).subscribe({
        next: this.handleEditResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    } else {
      this.userThreadService.create(newUserThread).subscribe({
        next: this.handleCreateResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    }
  }

  handleCreateResponse(data:any){
    if(data !== null){
      this.snackBar.open('Successfully created a new user thread!', 'dismiss',{
        duration: 3000
      });
      this.closeDialog(data)
    }
  }

  handleEditResponse(data:any){
    if(data !== null && data !== undefined){

      if(this.data !== null){
        this.snackBar.open('Successfully edited a thread!', 'dismiss',{
          duration: 3000
        });
        this.closeDialog(data);
      } else {
        this.snackBar.open('Successfully edited a thread!', 'dismiss',{
          duration: 3000
        });
        this.router.navigate(['/all-threads']);
      }
      
    }
  }

  handleErrorResponse(error:any){
    this.snackBar.open(error.message, 'dismiss',{
      duration: 3000
    });
  }

  closeDialog(data?:any){
    if(data !== null){
      this.dialogRef?.close({event: 'Edited Thread', data: data});
    } else {
      this.dialogRef?.close({event:'Cancel'});
    }
  }

  async loadAllThreads(){
    try{
      this.allThreadNames = await lastValueFrom(this.threadService.getAllThreadNames().pipe());
    } catch(err){
      this.snackBar.open('Error loading all threads!', 'dismiss', {
        duration: 3000
      });
      console.log(err);
    }
  }

  async getSingleThread(threadID: Number){
    try{
      return await lastValueFrom(this.threadService.get(threadID).pipe());
    } catch(err){
      console.log(err);
      return `Can't find thread based on threadID`;
    }
  }

}
