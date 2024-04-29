import { Component, Inject, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Thread } from 'src/app/models/thread.model';
import { BoardService } from 'src/app/services/board.service';
import { ThreadService } from 'src/app/services/thread.service';
import { BoardName } from 'src/app/models/boardName.model';
import { UserService } from 'src/app/services/user.service';
import { jwtDecode } from "jwt-decode";

@Component({
  selector: 'app-add-thread',
  templateUrl: './add-thread.component.html',
  styleUrls: ['./add-thread.component.css']
})
export class AddThreadComponent {
  constructor(
    private threadService: ThreadService,
    private snackBar: MatSnackBar,
    private boardService: BoardService,
    private userService: UserService,
    private router: Router,
    @Optional() private dialogRef?: MatDialogRef<AddThreadComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }

  addThreadForm = new FormGroup({
    boardName: new FormControl('', [Validators.required]),
    threadName: new FormControl('', [Validators.required]),
    createdAt: new FormControl(''),
    updatedAt: new FormControl('')
  });

  isEdit: boolean = false;
  allBoardNames: BoardName[];
  userID: Number = 0;

  async ngOnInit() {
    let token = localStorage.getItem('token');
    if(token != null){
      let decoded: any = jwtDecode(token);
      let localUserName = decoded.userName;
      if(localUserName !== '' && localUserName !== undefined && localUserName !== null){
        let user =  await lastValueFrom(this.userService.getUserByName(localUserName).pipe());
        if(user !== null && user !== undefined && user.userID !== undefined){
          this.userID = user.userID;
        }
      }
      if(this.data !== null && this.data !== undefined && this.data.allBoards !== null && this.data.allBoards !== undefined){
        this.allBoardNames = this.data.allBoardNames;
      } else {
        await this.loadAllBoardNames();
      }
      if(this.data !== null && this.data != undefined && this.data.isEdit == true){
        this.isEdit = true;
        let boardName = `${this.data.element.boardName}`;
        let threadName = `${this.data.element.threadName}`;
        let createdAt = `${this.data.element.createdAt}`;
        let updatedAt = `${this.data.element.updatedAt}`;
        this.addThreadForm.controls.boardName.patchValue(boardName);
        this.addThreadForm.controls.threadName.patchValue(threadName);
        this.addThreadForm.controls.createdAt.patchValue(createdAt);
        this.addThreadForm.controls.updatedAt.patchValue(updatedAt);
      }
      if(this.data.board !== null && this.data.board !== undefined && this.data.isEdit == false){
        let boardID = this.data.board.boardID;
        let boardName = this.allBoardNames.find(obj => obj.boardID == boardID)?.boardName;
        boardName = `${boardName}`;
        this.addThreadForm.controls.boardName.patchValue(boardName);
      }
    }
  }

  onSubmit(){
    let newThread: Thread = {
      threadID: 0,
      boardID: 0,
      boardName: '',
      userID: 0,
      threadName: '',
      createdAt: '',
      updatedAt: ''
    };
    newThread.boardName = this.addThreadForm.controls.boardName.value || '';
    newThread.boardID = this.allBoardNames.find(obj => obj.boardName === newThread.boardName)?.boardID;
    newThread.userID = this.userID;
    newThread.threadName = this.addThreadForm.controls.threadName.value || '';
    newThread.createdAt = this.addThreadForm.controls.createdAt.value || '';
    newThread.updatedAt = this.addThreadForm.controls.updatedAt.value || '';
    if(this.isEdit){
      newThread.boardID = this.data.element?.boardID;
      newThread.threadID = this.data.element?.threadID;
      this.threadService.update(newThread).subscribe({
        next: this.handleEditResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    } else {
      this.threadService.create(newThread).subscribe({
        next: this.handleCreateResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    }
  }

  handleCreateResponse(data:any){
    if(data !== null){

      if(this.data !== null){
        this.snackBar.open('Successfully created a new thread!', 'dismiss',{
          duration: 3000
        });
        this.closeDialog(data)
      } else {
        this.snackBar.open('Successfully created a new thread!', 'dismiss',{
          duration: 3000
        });
        this.router.navigate(['/all-threads']);
      }
      
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
    if(error.error !== undefined){
      this.snackBar.open(error.error.message, 'dismiss',{
        duration: 3000
      });
    } else {
      this.snackBar.open(error.message, 'dismiss',{
        duration: 3000
      });
    }
  }

  closeDialog(data?:any){
    if(data !== null){
      this.dialogRef?.close({event: 'Edited Thread', data: data});
    } else {
      this.dialogRef?.close({event:'Cancel'});
    }
  }

  async loadAllBoardNames(){
    try{
      this.allBoardNames = await lastValueFrom(this.boardService.getAllBoardNames().pipe());
    } catch(err){
      this.snackBar.open('Error loading board names!', 'dismiss', {
        duration: 3000
      });
      console.log(err);
    }
  }
}
