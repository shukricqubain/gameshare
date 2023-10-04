import { Component, Inject, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AchievementName } from 'src/app/models/achievementName.model';
import { GameName } from 'src/app/models/gameName.model';
import { UserAchievement } from 'src/app/models/userAchievement.model';
import { AchievementService } from 'src/app/services/achievement.service';
import { UserAchievementService } from 'src/app/services/userAchievement.service';

@Component({
  selector: 'app-add-user-achievement',
  templateUrl: './add-user-achievement.component.html',
  styleUrls: ['./add-user-achievement.component.css']
})
export class AddUserAchievementComponent {

  constructor(
    private achievementService: AchievementService,
    private userAchievementService: UserAchievementService,
    private snackBar: MatSnackBar,
    @Optional() private dialogRef?: MatDialogRef<AddUserAchievementComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }

  addUserAchievementForm = new FormGroup({
    achievementID: new FormControl(0, [Validators.required]),
    gameID: new FormControl(0, [Validators.required]),
    userID: new FormControl(0, [Validators.required]),
    achievementStatus: new FormControl('', [Validators.required]),
    createdAt: new FormControl(''),
    updatedAt: new FormControl('')
  });

  allGameNames: GameName[] = [];
  allAchievementNames: AchievementName[] = [];
  allDisplayedNames: AchievementName[] = [];
  allAchievementStatuses: String[] = [
    'Not Started',
    'In Progress',
    'Completed'
  ];

  isEdit: boolean = false;

  async ngOnInit() {
    this.allGameNames = this.data.allGameNames;
    let userID = Number(this.data.userID);
    this.addUserAchievementForm.controls.userID.patchValue(userID);
    if(this.data.allAchievementNames !== null && this.data.allAchievementNames !== undefined){
      this.allAchievementNames = this.data.allAchievementNames;
    } else {
      await this.loadAchievementNames();
    }

    if (this.data !== null && this.data != undefined && this.data.isEdit == true) {
      this.isEdit = true;
      let achievementID = this.data.element.achievementID;
      let achievementName = this.allAchievementNames.find(obj => obj.achievementID == achievementID)?.achievementName;
      let gameID = this.data.element.gameID;
      let gameName = this.allGameNames.find(obj => obj.gameID == gameID)?.gameName;
      let userID = this.data.userID;
      let achievementStatus = this.data.element.achievementStatus;
      let createdAt = `${this.data.element.createdAt}`;
      let updatedAt = `${this.data.element.updatedAt}`;
      if(achievementName !== null && achievementName !== undefined && gameName !== null && gameName !== undefined){
        this.addUserAchievementForm.controls.achievementID.patchValue(achievementID);
        this.addUserAchievementForm.controls.gameID.patchValue(gameID);
        this.addUserAchievementForm.controls.userID.patchValue(userID);
        this.addUserAchievementForm.controls.achievementStatus.patchValue(achievementStatus);
        this.addUserAchievementForm.controls.createdAt.patchValue(createdAt);
        this.addUserAchievementForm.controls.updatedAt.patchValue(updatedAt);
      }
      

    }
  }

  onSubmit() {
    let newAchievement: UserAchievement = {
      achievementID: 0,
      achievementName: '',
      gameID: 0,
      gameName: '',
      userID: 0,
      achievementStatus: '',
      createdAt: '',
      updatedAt: ''
    }
    newAchievement.gameID = this.addUserAchievementForm.controls.gameID.value || 0;
    let gameName = this.allGameNames.find(obj => obj.gameID == newAchievement.gameID);
    newAchievement.achievementID = this.addUserAchievementForm.controls.achievementID.value || 0;
    let achievementName = this.allAchievementNames.find(obj => obj.achievementID == newAchievement.achievementID);
    if(gameName !== undefined){
      newAchievement.gameName = gameName.gameName;
    } else {
      this.snackBar.open('Game name somehow not found!', 'dismiss', {
        duration: 3000
      });
      return;
    }
    if(achievementName !== undefined){
      newAchievement.achievementName = achievementName.achievementName;
    } else {
      this.snackBar.open('Achievement name somehow not found!', 'dismiss', {
        duration: 3000
      });
      return;
    }
    newAchievement.userID = this.data.userID;
    newAchievement.achievementStatus = this.addUserAchievementForm.controls.achievementStatus.value || '';
    newAchievement.createdAt = this.addUserAchievementForm.controls.createdAt.value || '';
    newAchievement.updatedAt = this.addUserAchievementForm.controls.updatedAt.value || '';
    if (this.isEdit) {
      newAchievement.userAchievementID = this.data.element.userAchievementID;
      this.userAchievementService.update(newAchievement).subscribe({
        next: this.handleEditResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    } else {
      this.userAchievementService.create(newAchievement).subscribe({
        next: this.handleCreateResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    }

  }

  handleCreateResponse(data: any) {
    if (data !== null) {

      if (this.data !== null) {
        this.snackBar.open('Successfully created a new achievement!', 'dismiss', {
          duration: 3000
        });
        this.closeDialog(data)
      } else {
        this.snackBar.open('Some error occurred while creating a new achievement!', 'dismiss', {
          duration: 3000
        });
      }

    }
  }

  handleEditResponse(data: any) {
    if (data !== null && data !== undefined) {
      this.snackBar.open('Successfully edited an achievement!', 'dismiss', {
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
      this.dialogRef?.close({ event: 'Edited Achievement', data: data });
    } else {
      this.dialogRef?.close({ event: 'Cancel' });
    }
  }

  async loadAchievementNames(){
    try{
      this.allAchievementNames = await lastValueFrom(this.achievementService.getAllAchievementsNames().pipe());
      this.allDisplayedNames = this.allAchievementNames;
    } catch(err){
      this.snackBar.open('Error loading achievement names!', 'dismiss', {
        duration: 3000
      });
      console.log(err);
    }
  }

  filterAchievementsByGame($event: any){
    this.allDisplayedNames = this.allAchievementNames.filter(game => {
      return game.gameID == $event.value;
    });
  }

}
