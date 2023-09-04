import { Component, Inject, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GameService } from 'src/app/services/game.service';
import { Game } from 'src/app/models/game.model';
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-game',
  templateUrl: './add-game.component.html',
  styleUrls: ['./add-game.component.css']
})
export class AddGameComponent {

  addGameForm = new FormGroup({
    gameName: new FormControl('', [Validators.required]),
    developers: new FormControl('', [Validators.required]),
    publishers: new FormControl('', [Validators.required]),
    genre: new FormControl('', [Validators.required]),
    releaseDate: new FormControl('', [Validators.required]),
    gameCover: new FormControl(''),
    createdAt: new FormControl(''),
    updatedAt: new FormControl('')
  });

  constructor(
    private gameService: GameService,
    private snackBar: MatSnackBar,
    private router: Router,
    @Optional() private dialogRef?: MatDialogRef<AddGameComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: Game
  ) {
  }

  isEdit: boolean = false;

  ngOnInit() {
    if(this.data !== null && this.data != undefined){
      this.isEdit = true;
      let gameName = `${this.data.gameName}`;
      let developers = `${this.data.developers}`;
      let publishers = `${this.data.publishers}`;
      let genre = `${this.data.genre}`;
      let releaseDate = `${this.data.releaseDate}`;
      let gameCover = `${this.data.gameCover}`;
      let createdAt = `${this.data.createdAt}`;
      let updatedAt = `${this.data.updatedAt}`;
      this.addGameForm.controls.gameName.patchValue(gameName);
      this.addGameForm.controls.developers.patchValue(developers);
      this.addGameForm.controls.publishers.patchValue(publishers);
      this.addGameForm.controls.genre.patchValue(genre);
      this.addGameForm.controls.releaseDate.patchValue(releaseDate);
      this.addGameForm.controls.gameCover.patchValue(gameCover);
      this.addGameForm.controls.createdAt.patchValue(createdAt);
      this.addGameForm.controls.updatedAt.patchValue(updatedAt);
    }
  }

  onSubmit(){
    let newGame: Game = {
      gameID: 0,
      gameName: '',
      developers: '',
      publishers: '',
      genre: '',
      releaseDate: '',
      gameCover: '',
      createdAt: '',
      updatedAt: ''
    }
    newGame.gameName = this.addGameForm.controls.gameName.value || '';
    newGame.developers = this.addGameForm.controls.developers.value || '';
    newGame.publishers = this.addGameForm.controls.publishers.value || '';
    newGame.genre = this.addGameForm.controls.genre.value || '';
    newGame.releaseDate = this.addGameForm.controls.releaseDate.value || '';
    newGame.gameCover = this.addGameForm.controls.gameCover.value || '';
    newGame.createdAt = this.addGameForm.controls.createdAt.value || '';
    newGame.updatedAt = this.addGameForm.controls.updatedAt.value || '';
    if(this.isEdit){
      newGame.gameID = this.data?.gameID;
      this.gameService.update(newGame).subscribe({
        next: this.handleEditResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    } else {
      this.gameService.create(newGame).subscribe({
        next: this.handleCreateResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    }
    
  }

  handleCreateResponse(data:any){
    if(data !== null){
      this.snackBar.open('Successfully created a new game!', 'dismiss',{
        duration: 3000
      });
      this.router.navigate(['/all-games']);
    }
  }

  handleEditResponse(data:any){
    if(data !== null && data !== undefined){
      this.snackBar.open('Successfully edited a game!', 'dismiss',{
        duration: 3000
      });
      this.closeDialog(data)
    }
  }

  handleErrorResponse(error:any){
    this.snackBar.open(error.message, 'dismiss',{
      duration: 3000
    });
  }

  editGame(){
    this.dialogRef?.close({
      data:this.data
    });
  }

  closeDialog(data?:any){
    if(data !== null){
      this.dialogRef?.close({event: 'Edited Game', data: data});
    } else {
      this.dialogRef?.close({event:'Cancel'});
    }
  }

}
