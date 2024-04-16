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

  constructor(
    private gameService: GameService,
    private snackBar: MatSnackBar,
    private router: Router,
    @Optional() private dialogRef?: MatDialogRef<AddGameComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }

  addGameForm = new FormGroup({
    gameName: new FormControl('', [Validators.required]),
    developers: new FormControl('', [Validators.required]),
    publishers: new FormControl('', [Validators.required]),
    genre: new FormControl('', [Validators.required]),
    releaseDate: new FormControl('', [Validators.required]),
    gameCoverFileName: new FormControl(''),
    platform: new FormControl('', [Validators.required]),
    createdAt: new FormControl(''),
    updatedAt: new FormControl('')
  });

  isEdit: boolean = false;
  gameNotFound: boolean = false;
  existingGame: Game;
  fileName: string;

  ngOnInit() {
    if (this.data !== null && this.data != undefined && this.data.isEdit == true) {
      this.isEdit = true;
      let gameName = `${this.data.element.gameName}`;
      let developers = `${this.data.element.developers}`;
      let publishers = `${this.data.element.publishers}`;
      let genre = `${this.data.element.genre}`;
      let releaseDate = `${this.data.element.releaseDate}`;
      let gameCoverFileName = `${this.data.element.gameCoverFileName}`;
      let platform = `${this.data.element.platform}`;
      let createdAt = `${this.data.element.createdAt}`;
      let updatedAt = `${this.data.element.updatedAt}`;
      let fileName = `${this.data.element.gameCoverFileName}`;
      this.addGameForm.controls.gameName.patchValue(gameName);
      this.addGameForm.controls.developers.patchValue(developers);
      this.addGameForm.controls.publishers.patchValue(publishers);
      this.addGameForm.controls.genre.patchValue(genre);
      this.addGameForm.controls.releaseDate.patchValue(releaseDate);
      this.addGameForm.controls.gameCoverFileName.patchValue(gameCoverFileName);
      this.addGameForm.controls.platform.patchValue(platform);
      this.addGameForm.controls.createdAt.patchValue(createdAt);
      this.addGameForm.controls.updatedAt.patchValue(updatedAt);
      this.addGameForm.controls.gameCoverFileName.patchValue(fileName);
      this.fileName = fileName;
    }
  }

  onSubmit() {
    let newGame: Game = {
      gameID: 0,
      gameName: '',
      developers: '',
      publishers: '',
      genre: '',
      releaseDate: '',
      gameCoverFileName: '',
      platform: '',
      createdAt: '',
      updatedAt: ''
    }
    newGame.gameName = this.addGameForm.controls.gameName.value || '';
    newGame.developers = this.addGameForm.controls.developers.value || '';
    newGame.publishers = this.addGameForm.controls.publishers.value || '';
    newGame.genre = this.addGameForm.controls.genre.value || '';
    newGame.releaseDate = this.addGameForm.controls.releaseDate.value || '';
    newGame.gameCoverFileName = this.addGameForm.controls.gameCoverFileName.value || '';
    newGame.platform = this.addGameForm.controls.platform.value || '';
    newGame.createdAt = this.addGameForm.controls.createdAt.value || '';
    newGame.updatedAt = this.addGameForm.controls.updatedAt.value || '';
    if (this.isEdit) {
      newGame.gameID = this.data.element?.gameID;
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

  handleUploadResponse(data: any){
    if(data){
      this.snackBar.open('Successfully uploaded game cover!', 'dismiss', {
        duration: 3000
      });
      this.addGameForm.controls.gameCoverFileName.markAsDirty();
    } else {
      this.snackBar.open('Error occurred uploading game cover!', 'dismiss', {
        duration: 3000
      });
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

  checkGameExists() {
    if (!this.isEdit) {
      let gameName = this.addGameForm.controls.gameName.value ? this.addGameForm.controls.gameName.value : '';
      if (gameName !== '') {
        this.gameService!.getByName(gameName).subscribe({
          next: this.handleGetResponse.bind(this),
          error: this.handleErrorResponse.bind(this)
        });
      }
    }

  }

  handleGetResponse(data: any) {
    if (data == null && data == undefined) {
      this.snackBar.open('No game found with that name.', 'dismiss', {
        duration: 3000
      });
      this.gameNotFound = true;
    } else {
      this.snackBar.open('Game already exists with this name, please enter another name.', 'dismiss', {
        duration: 3000
      });
      this.gameNotFound = false;
      this.existingGame = data;
    }

  }

  onFileSelected(event: any) {

    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name.toLowerCase();
      const formData = new FormData();
      formData.append("fileName", file.name);
      formData.append("imageFile", file);
      let assetLocation = 'game-covers';
      let gameCoverFileName = `assets/${assetLocation}/${this.fileName}`;
      this.addGameForm.controls.gameCoverFileName.patchValue(gameCoverFileName);
      this.gameService.uploadGameCover(assetLocation, formData).subscribe({
        next: this.handleUploadResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    }
  }
}
