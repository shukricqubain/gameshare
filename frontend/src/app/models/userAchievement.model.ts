import { Achievement } from "./achievement.model";

export class UserAchievement {
    userAchievementID?: Number;
    achievementID?: Number;
    achievementName?: string;
    gameID?: Number;
    gameName?: string;
    userID?: Number;
    achievementStatus?: string;
    achievement?: Achievement;
    completedUserAchievementRatio?: string;
    createdAt?: string;
    updatedAt?: string;
}