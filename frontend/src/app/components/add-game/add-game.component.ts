import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GameService } from 'src/app/services/game.service';
import { Game } from 'src/app/models/game.model';
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from '@angular/router';

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
    private router: Router
    
  ) {
  }

  ngOnInit() {

  }

  onSubmit(){
    let newGame = {
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
    this.gameService.create(newGame).subscribe({
      next: this.handleCreateResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

  handleCreateResponse(data:any){
    if(data !== null){
      this.snackBar.open('Successfully created a new game!', 'dismiss',{
        duration: 3000
      });
      this.router.navigate(['/all-games']);
    }
  }

  handleErrorResponse(error:any){
    this.snackBar.open(error.message, 'dismiss',{
      duration: 3000
    });
  }

}
