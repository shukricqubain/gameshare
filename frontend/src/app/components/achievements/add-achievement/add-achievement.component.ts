import { Component, Inject, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Achievement } from 'src/app/models/achievement.model';
import { Game } from 'src/app/models/game.model';
import { GameName } from 'src/app/models/gameName.model';
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
    gameID: new FormControl(0, [Validators.required]),
    achievementName: new FormControl('', [Validators.required]),
    achievementDescription: new FormControl('', [Validators.required]),
    achievementIconFileName: new FormControl(''),
    createdAt: new FormControl(''),
    updatedAt: new FormControl('')
  });

  
  isEdit: boolean = false;
  gameNotFound: boolean = false;
  allGameNames: GameName[] = [];
  fileName: string;

  async ngOnInit() {
    await this.loadAllGameNames();
    if(this.data !== null && this.data != undefined){
      this.isEdit = true;
      let gameName= `${this.data.gameName}`;
      let gameID = this.allGameNames.find(obj => obj.gameName === gameName);
      if(gameID !== undefined && gameID.gameID !== undefined){
        let idValue = Number(gameID.gameID);
        this.addAchievementForm.controls.gameID.patchValue(idValue);
      }
      let achievementName = `${this.data.achievementName}`;
      let achievementDescription = `${this.data.achievementDescription}`;
      let achievementIconFileName = `${this.data.achievementIconFileName}`;
      let createdAt = `${this.data.createdAt}`;
      let updatedAt = `${this.data.updatedAt}`;
      
      this.addAchievementForm.controls.achievementName.patchValue(achievementName);
      this.addAchievementForm.controls.achievementDescription.patchValue(achievementDescription);
      this.addAchievementForm.controls.achievementIconFileName.patchValue(achievementIconFileName);
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
      achievementIconFileName: '',
      createdAt: '',
      updatedAt: ''
    }
    newAchievement.gameID = Number (this.addAchievementForm.controls.gameID.value) || 0;
    let game = this.allGameNames.find(obj => obj.gameID == newAchievement.gameID);
    newAchievement.gameName = game?.gameName;
    newAchievement.achievementName = this.addAchievementForm.controls.achievementName.value || '';
    newAchievement.achievementDescription = this.addAchievementForm.controls.achievementDescription.value || '';
    newAchievement.achievementIconFileName = this.addAchievementForm.controls.achievementIconFileName.value || '';
    newAchievement.createdAt = this.addAchievementForm.controls.createdAt.value || '';
    newAchievement.updatedAt = this.addAchievementForm.controls.updatedAt.value || '';
    if(this.isEdit){
      newAchievement.achievementID = this.data?.achievementID;
      this.achievementService.update(newAchievement).subscribe({
        next: this.handleEditResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    } else {
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
      this.closeDialog(data);
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

  handleErrorResponse(error:any){
    if(error.error === 'Cannot find game with specified gameName'){
      this.snackBar.open('Please enter a game that exists within the gameshare database.', 'dismiss',{
        duration: 3000
      });
      this.gameNotFound = true;
    }
  }

  handleUploadResponse(data: any){
    if(data){
      this.snackBar.open('Successfully uploaded achievement icon!', 'dismiss', {
        duration: 3000
      });
      this.addAchievementForm.controls.achievementIconFileName.markAsDirty();
    } else {
      this.snackBar.open('Error occurred uploading achievement icon!', 'dismiss', {
        duration: 3000
      });
    }
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

  async loadAllGameNames(){
    try{
      this.allGameNames = await lastValueFrom(this.gameService.getAllGameNames().pipe());
    } catch(err){
      this.snackBar.open('Error loading game names!', 'dismiss', {
        duration: 3000
      });
      console.log(err);
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name.toLowerCase();
      const formData = new FormData();
      formData.append("fileName", file.name);
      formData.append("imageFile", file);
      let assetLocation = 'achievement-icons';
      let achievementIconFileName = `assets/${assetLocation}/${this.fileName}`;
      this.addAchievementForm.controls.achievementIconFileName.patchValue(achievementIconFileName);
      this.achievementService.uploadAchievementIcon(assetLocation, formData).subscribe({
        next: this.handleUploadResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    }
  }
}
