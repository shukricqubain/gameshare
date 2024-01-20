import { Component, Input } from '@angular/core';
import { UserAchievement } from 'src/app/models/userAchievement.model';

@Component({
  selector: 'app-user-achievement',
  templateUrl: './user-achievement.component.html',
  styleUrls: ['./user-achievement.component.css']
})
export class UserAchievementComponent {

  @Input() userAchievement: UserAchievement;

  constructor(){}

  ngOnInit(){}

}
