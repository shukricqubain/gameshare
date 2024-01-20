import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Achievement } from 'src/app/models/achievement.model';
import { Game } from 'src/app/models/game.model';
import { AchievementService } from 'src/app/services/achievement.service';
import { DateFunctionsService } from 'src/app/services/dateFunctions.service';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.css']
})
export class GameInfoComponent {

  constructor(
    private snackBar: MatSnackBar,
    private achievementService: AchievementService,
    private gameService: GameService,
    private dateFunction: DateFunctionsService,
    @Optional() private dialogRef?: MatDialogRef<GameInfoComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any){
  }

  game: any;
  achievements: Achievement[];
  isLoadingAchievements: boolean = true;
  gameLoaded: boolean = false;

  async ngOnInit(){
    if(this.data.game != undefined){
      this.game = this.data.game;
      this.gameLoaded = true;
    } else if(this.data.userGame != undefined){
      this.game = this.data.userGame;
      this.game.gameCover = this.game.game.gameCover;
      await this.loadGame();

    }
    await this.loadGameAchievements();
  }

  async loadGameAchievements(){
    try{
      let result = await lastValueFrom(this.achievementService.getByGameID(this.game.gameID).pipe());
      if(result.message == undefined){
        this.achievements = result;        
      } else {
        this.achievements = [];
      }
      this.isLoadingAchievements = false;
    } catch(err){
      console.log(err);
      this.snackBar.open(`Error loading achievements for ${this.game.gameName}.`, 'dismiss', {
        duration: 3000
      });
    }
  }

  async loadGame(){
    try{
      let result = await lastValueFrom(this.gameService.get(this.game.gameID).pipe());
      console.log(result);
      this.game = result;
      this.gameLoaded = true;
    } catch(err){
      console.log(err);
      this.snackBar.open(`Error loading game with ID of ${this.game.gameID}.`, 'dismiss', {
        duration: 3000
      });
    }
  }

  public formatDate(date: any) {
    let formattedDate = this.dateFunction.formatDateMMDDYYYY(date);
    return formattedDate;
  }
}
