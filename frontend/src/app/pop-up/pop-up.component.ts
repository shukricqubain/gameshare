import { ChangeDetectorRef, Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Achievement } from '../models/achievement.model';

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.css']
})
export class PopUpComponent {


  constructor(
    @Optional() private dialogRef?: MatDialogRef<PopUpComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any,

  ) {
  }

  model: string;
  name: string;
  allGameNames: any;
  allAchievementNames: any;
  dataLoaded: boolean;

  ngAfterContentInit() {
    this.dataLoaded = false;
    if (this.data !== null && this.data !== undefined) {
      switch (this.data.model) {
        case ('user'):
          this.name = this.data.element.userName;
          this.model = this.data.model;
          this.dataLoaded = true;
          break;
        case ('game'):
          this.name = this.data.element.gameName;
          this.model = this.data.model;
          this.dataLoaded = true;
          break;
        case ('achievement'):
          this.name = this.data.element.achievementName;
          this.model = this.data.model;
          this.dataLoaded = true;
          break;
        case ('userGame'):
          this.allGameNames = this.data.allGameNames;
          let gameID = this.data.element.gameID;
          let game = this.allGameNames.filter((obj: { gameID: any; }) => obj.gameID == gameID);
          if (game.length > 0) {
            game = game[0];
          } else {
            ///throw error no game found
          }
          this.name = game.gameName;
          this.model = this.data.model;
          this.dataLoaded = true;
          break;
        case ('userAchievement'):
          this.allAchievementNames = this.data.allAchievementNames;
          let achievementID = this.data.element.achievementID;
          let achievement = this.allAchievementNames.filter((obj: { achievementID: any; }) => obj.achievementID == achievementID);
          if (achievement.length > 0) {
            achievement = achievement[0];
          } else {
            ///throw error no game found
          }
          this.name = achievement.achievementName;
          this.model = this.data.model;
          this.dataLoaded = true;
          break;
      }
    }

  }

  onSubmit() {
    this.dialogRef?.close({
      event: 'delete'
    });
  }

  closeDialog() {
    this.dialogRef?.close({ event: 'Cancel' });
  }

}
