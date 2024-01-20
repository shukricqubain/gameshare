import { Component, Inject, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GameName } from 'src/app/models/gameName.model';
import { UserGame } from 'src/app/models/userGame.model';
import { GameService } from 'src/app/services/game.service';
import { UserGameService } from 'src/app/services/userGame.service';

@Component({
  selector: 'app-add-user-game',
  templateUrl: './add-user-game.component.html',
  styleUrls: ['./add-user-game.component.css']
})
export class AddUserGameComponent {

  constructor(
    private gameService: GameService,
    private userGameService: UserGameService,
    private snackBar: MatSnackBar,
    private router: Router,
    @Optional() private dialogRef?: MatDialogRef<AddUserGameComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }

  addUserGameForm = new FormGroup({
    gameID: new FormControl(0, [Validators.required]),
    userID: new FormControl(0, [Validators.required]),
    gameEnjoymentRating: new FormControl(0, [Validators.required]),
    createdAt: new FormControl(''),
    updatedAt: new FormControl('')
  });

  ratings = [1,2,3,4,5,6,7,8,9,10]
  allGameNames: GameName[] = [];
  isEdit: boolean = false;
  gameName: string = '';

  async ngOnInit() {
    this.allGameNames = this.data.allGameNames;
    if (this.data !== null && this.data != undefined && this.data.isEdit == true) {
      this.isEdit = true;
      let gameID = this.data.element.gameID;
      let userID = this.data.element.userID;
      let gameEnjoymentRating = this.data.element.gameEnjoymentRating;
      let createdAt = `${this.data.element.createdAt}`;
      let updatedAt = `${this.data.element.updatedAt}`;
      this.gameName = this.data.element.gameName;
      this.addUserGameForm.controls.gameID.patchValue(gameID);
      this.addUserGameForm.controls.userID.patchValue(userID);
      this.addUserGameForm.controls.gameEnjoymentRating.patchValue(gameEnjoymentRating);
      this.addUserGameForm.controls.createdAt.patchValue(createdAt);
      this.addUserGameForm.controls.updatedAt.patchValue(updatedAt);
    }
  }

  onSubmit() {
    if(this.isEdit){
      let updatedGame: UserGame = {
        userGameID: 0,
        gameID: 0,
        gameName: '',
        userID: 0,
        gameEnjoymentRating: 0,
        createdAt: '',
        updatedAt: ''
      }
      updatedGame.gameID = this.addUserGameForm.controls.gameID.value || 0;
      updatedGame.gameName = this.gameName;
      updatedGame.userID = this.addUserGameForm.controls.userID.value || 0;
      updatedGame.userGameID = this.data.element.userGameID;
      updatedGame.gameEnjoymentRating = this.addUserGameForm.controls.gameEnjoymentRating.value || 0;
      updatedGame.createdAt = this.addUserGameForm.controls.createdAt.value || '';
      updatedGame.updatedAt = this.addUserGameForm.controls.updatedAt.value || '';
      this.userGameService.update(updatedGame).subscribe({
        next: this.handleEditResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    } else {
      let newGame: UserGame = {
        userGameID: 0,
        gameID: 0,
        gameName: '',
        userID: 0,
        gameEnjoymentRating: 0,
        createdAt: '',
        updatedAt: ''
      }
      newGame.gameID = this.addUserGameForm.controls.gameID.value || 0;
      let gameName = this.allGameNames.find(obj => obj.gameID == newGame.gameID);
      if(gameName !== undefined){
        newGame.gameName = gameName.gameName;
      } else {
        this.snackBar.open('Game name somehow not found!', 'dismiss', {
          duration: 3000
        });
        return;
      }
      newGame.userID = this.data.userID;
      newGame.gameEnjoymentRating = this.addUserGameForm.controls.gameEnjoymentRating.value || 0;
      newGame.createdAt = this.addUserGameForm.controls.createdAt.value || '';
      newGame.updatedAt = this.addUserGameForm.controls.updatedAt.value || '';
      this.userGameService.create(newGame).subscribe({
        next: this.handleCreateResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    }
  }

  handleCreateResponse(data: any) {
    if (data !== null) {

      if (this.data !== null) {
        this.snackBar.open('Successfully created a new game!', 'dismiss', {
          duration: 3000
        });
        this.closeDialog(data)
      } else {
        this.snackBar.open('Some error occurred while creating a new game!', 'dismiss', {
          duration: 3000
        });
      }

    }
  }

  handleEditResponse(data: any) {
    if (data !== null && data !== undefined) {
      this.snackBar.open('Successfully edited a game!', 'dismiss', {
        duration: 3000
      });
      this.closeDialog(data);
    }
  }

  handleErrorResponse(error: any) {
    if(error.error != undefined && typeof error.error === 'string'){
      this.snackBar.open(error.error, 'dismiss', {
        duration: 3000
      });
    } else {
      this.snackBar.open(error, 'dismiss', {
        duration: 3000
      });
    }
    
  }

  editGame() {
    this.dialogRef?.close({
      data: this.data
    });
  }

  closeDialog(data?: any) {
    if (data != null && data != undefined) {
      this.dialogRef?.close({ event: 'Edited Game', data: data });
    } else {
      this.dialogRef?.close({ event: 'Cancel' });
    }
  }

}