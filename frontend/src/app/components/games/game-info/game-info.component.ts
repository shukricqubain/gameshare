import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Achievement } from 'src/app/models/achievement.model';
import { Game } from 'src/app/models/game.model';
import { AchievementService } from 'src/app/services/achievement.service';

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.css']
})
export class GameInfoComponent {

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private achievementService: AchievementService,
    @Optional() private dialogRef?: MatDialogRef<GameInfoComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any){
  }

  game: Game;
  achievements: Achievement[];

  async ngOnInit(){
    this.game = this.data.game;
    await this.loadGameAchievements();
  }

  async loadGameAchievements(){
    try{
      let result: Achievement[] = await lastValueFrom(this.achievementService.getByGameID(this.game.gameID).pipe());
      this.achievements = result; 
    } catch(err){
      console.log(err);
      this.snackBar.open(`Error loading achievements for ${this.game.gameName}.`, 'dismiss', {
        duration: 3000
      });
    }
  }
}
