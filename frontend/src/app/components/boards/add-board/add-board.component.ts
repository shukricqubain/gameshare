import { Component, Inject, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Board } from 'src/app/models/board.model';
import { GameName } from 'src/app/models/gameName.model';
import { BoardService } from 'src/app/services/board.service';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-add-board',
  templateUrl: './add-board.component.html',
  styleUrls: ['./add-board.component.css']
})
export class AddBoardComponent {

  constructor(
    private boardService: BoardService,
    private snackBar: MatSnackBar,
    private gameService: GameService,
    private router: Router,
    @Optional() private dialogRef?: MatDialogRef<AddBoardComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }

  addBoardForm = new FormGroup({
    boardName: new FormControl('', [Validators.required]),
    gameName: new FormControl('', [Validators.required]),
    createdAt: new FormControl(''),
    updatedAt: new FormControl('')
  });

  isEdit: boolean = false;
  allGameNames: GameName[] = [];

  async ngOnInit() {
    if(this.data !== null && this.data !== undefined && this.data.allGameNames !== null && this.data.allGameNames !== undefined){
      this.allGameNames = this.data.allGameNames;
    } else {
      await this.loadAllGameNames();
    }
    if(this.data !== null && this.data != undefined && this.data.isEdit == true){
      this.isEdit = true;
      let boardName = `${this.data.element.boardName}`;
      let gameName = `${this.data.element.gameName}`;
      let createdAt = `${this.data.element.createdAt}`;
      let updatedAt = `${this.data.element.updatedAt}`;
      this.addBoardForm.controls.boardName.patchValue(boardName);
      this.addBoardForm.controls.gameName.patchValue(gameName);
      this.addBoardForm.controls.createdAt.patchValue(createdAt);
      this.addBoardForm.controls.updatedAt.patchValue(updatedAt);
    }
  }

  onSubmit(){
    let newBoard: Board = {
      boardName: '',
      gameID: 0,
      gameName: '',
      createdAt: '',
      updatedAt: ''
    };
    newBoard.boardName = this.addBoardForm.controls.boardName.value || '';
    newBoard.gameName = this.addBoardForm.controls.gameName.value || '';
    newBoard.gameID = this.allGameNames.find(obj => obj.gameName == newBoard.gameName)?.gameID || 0;
    newBoard.createdAt = this.addBoardForm.controls.createdAt.value || '';
    newBoard.updatedAt = this.addBoardForm.controls.updatedAt.value || '';
    if(this.isEdit){
      newBoard.boardID = this.data.element?.boardID;
      this.boardService.update(newBoard).subscribe({
        next: this.handleEditResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    } else {
      this.boardService.create(newBoard).subscribe({
        next: this.handleCreateResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    }
  }

  handleCreateResponse(data:any){
    if(data !== null){

      if(this.data !== null){
        this.snackBar.open('Successfully created a new board!', 'dismiss',{
          duration: 3000
        });
        this.closeDialog(data)
      } else {
        this.snackBar.open('Successfully created a new board!', 'dismiss',{
          duration: 3000
        });
        this.router.navigate(['/all-boards']);
      }
      
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

  async loadAllGameNames(){
    try{
      this.allGameNames = await lastValueFrom(this.gameService.getAllGameNames().pipe());
    } catch(err){
      this.snackBar.open('Error loading game names!', 'dismiss', {
        duration: 3000
      });
      console.log(err);
    }
  }
}
