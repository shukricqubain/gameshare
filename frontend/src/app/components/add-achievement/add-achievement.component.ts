import { Component, Inject, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Achievement } from 'src/app/models/achievement.model';
import { Game } from 'src/app/models/game.model';
import { AchievementService } from 'src/app/services/achievement.service';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-add-achievement',
  templateUrl: './add-achievement.component.html',
  styleUrls: ['./add-achievement.component.css']
})
export class AddAchievementComponent {

  constructor(
    private achievementService: AchievementService,
    private gameService: GameService,
    private snackBar: MatSnackBar,
    private router: Router,
    @Optional() private dialogRef?: MatDialogRef<AddAchievementComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: Achievement
  ) {
  }

  addAchievementForm = new FormGroup({
    gameName: new FormControl('', [Validators.required]),
    achievementName: new FormControl('', [Validators.required]),
    achievementDescription: new FormControl('', [Validators.required]),
    achievementIcon: new FormControl(''),
    createdAt: new FormControl(''),
    updatedAt: new FormControl('')
  });

  
  isEdit: boolean = false;
  existingGame: Game;

  ngOnInit() {
    if(this.data !== null && this.data != undefined){
      this.isEdit = true;
      let gameName = `${this.data.gameName}`;
      let achievementName = `${this.data.achievementName}`;
      let achievementDescription = `${this.data.achievementDescription}`;
      let achievementIcon = `${this.data.achievementIcon}`;
      let createdAt = `${this.data.createdAt}`;
      let updatedAt = `${this.data.updatedAt}`;
      this.addAchievementForm.controls.gameName.patchValue(gameName);
      this.addAchievementForm.controls.achievementName.patchValue(achievementName);
      this.addAchievementForm.controls.achievementDescription.patchValue(achievementDescription);
      this.addAchievementForm.controls.achievementIcon.patchValue(achievementIcon);
      this.addAchievementForm.controls.createdAt.patchValue(createdAt);
      this.addAchievementForm.controls.updatedAt.patchValue(updatedAt);
    }
  }

  onSubmit(){
    let newAchievement: Achievement = {
      achievementID: 0,
      gameID: 0,
      gameName: '',
      achievementName: '',
      achievementDescription: '',
      achievementIcon: '',
      createdAt: '',
      updatedAt: ''
    }
    newAchievement.gameName = this.addAchievementForm.controls.gameName.value || '';
    newAchievement.achievementName = this.addAchievementForm.controls.achievementName.value || '';
    newAchievement.achievementDescription = this.addAchievementForm.controls.achievementDescription.value || '';
    newAchievement.achievementIcon = this.addAchievementForm.controls.achievementIcon.value || '';
    newAchievement.createdAt = this.addAchievementForm.controls.createdAt.value || '';
    newAchievement.updatedAt = this.addAchievementForm.controls.updatedAt.value || '';
    if(this.isEdit){
      newAchievement.achievementID = this.data?.achievementID;
      newAchievement.gameID = this.existingGame.gameID;
      this.achievementService.update(newAchievement).subscribe({
        next: this.handleEditResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    } else {
      newAchievement.gameID = this.existingGame.gameID;
      this.achievementService.create(newAchievement).subscribe({
        next: this.handleCreateResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    }
    
  }

  handleCreateResponse(data:any){
    if(data !== null){
      this.snackBar.open('Successfully created a new achievement!', 'dismiss',{
        duration: 3000
      });
      this.router.navigate(['/all-achievements']);
    }
  }

  handleEditResponse(data:any){
    if(data !== null && data !== undefined){
      this.snackBar.open('Successfully edited an achievement!', 'dismiss',{
        duration: 3000
      });
      this.closeDialog(data)
    }
  }

  handleGetResponse(data:any){
    if(data == null && data == undefined){
      this.snackBar.open('Please enter a game that exists within the gameshare database.', 'dismiss',{
        duration: 3000
      });
    } else {
      this.snackBar.open('Found the game, please enter achievement details.', 'dismiss',{
        duration: 3000
      });
      this.existingGame = data;
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
      this.dialogRef?.close({event: 'Edited Achievement', data: data});
    } else {
      this.dialogRef?.close({event:'Cancel'});
    }
  }

  checkGameExists(){
    let gameName = this.addAchievementForm.controls.gameName.value ? this.addAchievementForm.controls.gameName.value: '';
    this.gameService!.getByName(gameName).subscribe({
      next: this.handleGetResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

}
