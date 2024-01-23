import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserAchievement } from 'src/app/models/userAchievement.model';
import { DateFunctionsService } from 'src/app/services/dateFunctions.service';
import { UserAchievementService } from 'src/app/services/userAchievement.service';

@Component({
  selector: 'app-user-achievement',
  templateUrl: './user-achievement.component.html',
  styleUrls: ['./user-achievement.component.css']
})
export class UserAchievementComponent {

  @Input() userAchievement: UserAchievement;
  @Output() loadAchievementEvent = new EventEmitter<string>();

  constructor(
    private snackBar: MatSnackBar,
    private userAchievementService: UserAchievementService,
    private dateFunction: DateFunctionsService
  ){}

  ngOnInit(){}

  updateAchievementStatus($event: any, userAchievement: UserAchievement){
    let updatedAchievement: UserAchievement = {
      userAchievementID: 0,
      achievementID: 0,
      achievementName: '',
      gameID: 0,
      gameName: '',
      userID: 0,
      achievementStatus: '',
      createdAt: '',
      updatedAt: ''
    }
    updatedAchievement.userAchievementID = userAchievement.userAchievementID;
    updatedAchievement.achievementID = userAchievement.achievementID;
    updatedAchievement.achievementName = userAchievement.achievementName;
    updatedAchievement.gameID = userAchievement.gameID;
    updatedAchievement.gameName = userAchievement.gameName;
    updatedAchievement.userID = userAchievement.userID;
    updatedAchievement.achievementStatus = $event;
    updatedAchievement.createdAt = userAchievement.createdAt;
    updatedAchievement.updatedAt = userAchievement.updatedAt;
    this.userAchievementService.update(updatedAchievement).subscribe({
      next: this.handleEditResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

  handleEditResponse(data: any) {
    if (data !== null && data !== undefined) {
      // this.snackBar.open('Successfully edited an achievement!', 'dismiss', {
      //   duration: 3000
      // });
      ///reload event
      this.loadAchievementEvent.next('loadAchievement');
    }
  }

  handleErrorResponse(error: any) {
    this.snackBar.open(error.message, 'dismiss', {
      duration: 3000
    });
  }

  public formatDate(date: any) {
    let formattedDate = this.dateFunction.formatDateMMDDYYYY(date);
    return formattedDate;
  }

}
