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

  async ngOnInit() {
    console.log(this.data);
    this.allGameNames = this.data.allGameNames;
    if (this.data !== null && this.data != undefined && this.data.isEdit == true) {
      this.isEdit = true;
      let gameID = this.data.element.gameID;
      let userID = this.data.element.userID;
      let gameEnjoymentRating = this.data.element.gameEnjoymentRating;
      let createdAt = `${this.data.element.createdAt}`;
      let updatedAt = `${this.data.element.updatedAt}`;
      this.addUserGameForm.controls.gameID.patchValue(gameID);
      this.addUserGameForm.controls.userID.patchValue(userID);
      this.addUserGameForm.controls.gameEnjoymentRating.patchValue(gameEnjoymentRating);
      this.addUserGameForm.controls.createdAt.patchValue(createdAt);
      this.addUserGameForm.controls.updatedAt.patchValue(updatedAt);
    }
  }

  onSubmit() {
    let newGame: UserGame = {
      userGameID: 0,
      gameID: 0,
      userID: 0,
      gameEnjoymentRating: 0,
      createdAt: '',
      updatedAt: ''
    }
    newGame.gameID = this.addUserGameForm.controls.gameID.value || 0;
    newGame.userID = this.data.userID;
    newGame.gameEnjoymentRating = this.addUserGameForm.controls.gameEnjoymentRating.value || 0;
    newGame.createdAt = this.addUserGameForm.controls.createdAt.value || '';
    newGame.updatedAt = this.addUserGameForm.controls.updatedAt.value || '';
    if (this.isEdit) {
      this.userGameService.update(newGame).subscribe({
        next: this.handleEditResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    } else {
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
        this.snackBar.open('Successfully created a new game!', 'dismiss', {
          duration: 3000
        });
        this.router.navigate(['/all-games']);
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
    this.snackBar.open(error.message, 'dismiss', {
      duration: 3000
    });
  }

  editGame() {
    this.dialogRef?.close({
      data: this.data
    });
  }

  closeDialog(data?: any) {
    if (data !== null) {
      this.dialogRef?.close({ event: 'Edited Game', data: data });
    } else {
      this.dialogRef?.close({ event: 'Cancel' });
    }
  }

  

}