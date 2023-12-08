import { Component, Inject, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Board } from 'src/app/models/board.model';
import { BoardName } from 'src/app/models/boardName.model';
import { UserBoard } from 'src/app/models/userBoard.model';
import { BoardService } from 'src/app/services/board.service';
import { UserBoardService } from 'src/app/services/userBoard.service';

@Component({
  selector: 'app-add-user-board',
  templateUrl: './add-user-board.component.html',
  styleUrls: ['./add-user-board.component.css']
})
export class AddUserBoardComponent {

  constructor(
    private boardService: BoardService,
    private userBoardService: UserBoardService,
    private snackBar: MatSnackBar,
    private router: Router,
    @Optional() private dialogRef?: MatDialogRef<AddUserBoardComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }

  addUserBoardForm = new FormGroup({
    boardID: new FormControl('', [Validators.required]),
    createdAt: new FormControl(''),
    updatedAt: new FormControl('')
  });

  isEdit: boolean = false;
  allBoardNames: BoardName[];

  async ngOnInit() {
    if(this.data !== null && this.data !== undefined && this.data.allBoards !== null && this.data.allBoards !== undefined){
      this.allBoardNames = this.data.allBoardNames;
    } else {
      await this.loadAllBoards();
    }
    if(this.data !== null && this.data != undefined && this.data.isEdit == true){
      this.isEdit = true;
      let boardName = `${this.data.element.boardName}`;
      let createdAt = `${this.data.element.createdAt}`;
      let updatedAt = `${this.data.element.updatedAt}`;
      this.addUserBoardForm.controls.boardID.patchValue(boardName);
      this.addUserBoardForm.controls.createdAt.patchValue(createdAt);
      this.addUserBoardForm.controls.updatedAt.patchValue(updatedAt);
    }
  }

  async onSubmit(){
    let newUserBoard: UserBoard = {
      userBoardID: 0,
      boardName: '',
      boardID: 0,
      userID: 0,
      createdAt: '',
      updatedAt: ''
    };
    if(this.addUserBoardForm.controls.boardID.value !== undefined && this.addUserBoardForm.controls.boardID.value !== null){

      ///set boardID
      newUserBoard.boardID = parseInt(this.addUserBoardForm.controls.boardID.value) || 0;
      ///set boardName
      let boardName = this.allBoardNames.find(obj => obj.boardID == newUserBoard.boardID)?.boardName;
      if(boardName !== undefined){
        newUserBoard.boardName = boardName;
      } else {
        this.snackBar.open(`Error! Can't find board name based on selected boardID.`, 'dismiss', {
          duration: 3000
        });
      }

      ///grab gameID and gameName based on boardID
      let board: any = await this.getSingleBoard(newUserBoard.boardID);
      console.log(board)
      if(board != undefined && board != null && board !== `Can't find board based on boardID`){
        newUserBoard.gameID = parseInt(board.gameID);
        newUserBoard.gameName = board.gameName;
      } else {
        this.snackBar.open('Error finding board based on boardID', 'dismiss', {
          duration: 3000
        });
      }

    } else {
      this.snackBar.open(`Error! selected BoardID is undefined.`, 'dismiss', {
        duration: 3000
      });
    }
    newUserBoard.createdAt = this.addUserBoardForm.controls.createdAt.value || '';
    newUserBoard.updatedAt = this.addUserBoardForm.controls.updatedAt.value || '';
    newUserBoard.userID = this.data.userID || 0;
    console.log(newUserBoard);

    if(this.isEdit){
      newUserBoard.userBoardID = this.data.element?.userBoardID;
      this.userBoardService.update(newUserBoard).subscribe({
        next: this.handleEditResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    } else {
      this.userBoardService.create(newUserBoard).subscribe({
        next: this.handleCreateResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    }
  }

  handleCreateResponse(data:any){
    if(data !== null){
      this.snackBar.open('Successfully created a new user board!', 'dismiss',{
        duration: 3000
      });
      this.closeDialog(data)
    }
  }

  handleEditResponse(data:any){
    if(data !== null && data !== undefined){

      if(this.data !== null){
        this.snackBar.open('Successfully edited a board!', 'dismiss',{
          duration: 3000
        });
        this.closeDialog(data);
      } else {
        this.snackBar.open('Successfully edited a board!', 'dismiss',{
          duration: 3000
        });
        this.router.navigate(['/all-boards']);
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
      this.dialogRef?.close({event: 'Edited Board', data: data});
    } else {
      this.dialogRef?.close({event:'Cancel'});
    }
  }

  async loadAllBoards(){
    try{
      this.allBoardNames = await lastValueFrom(this.boardService.getAllBoardNames().pipe());
    } catch(err){
      this.snackBar.open('Error loading all boards!', 'dismiss', {
        duration: 3000
      });
      console.log(err);
    }
  }

  async getSingleBoard(boardID: Number){
    try{
      return await lastValueFrom(this.boardService.get(boardID).pipe());
    } catch(err){
      console.log(err);
      return `Can't find board based on boardID`;
    }
  }
}
