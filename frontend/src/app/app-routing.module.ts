import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { AllUsersComponent } from './components/all-users/all-users.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AllGamesComponent } from './components/all-games/all-games.component';
import { AddGameComponent } from './components/add-game/add-game.component';
import { AllAchievementsComponent } from './components/all-achievements/all-achievements.component';
import { AddAchievementComponent } from './components/add-achievement/add-achievement.component';
import { AllBoardsComponent } from './components/all-boards/all-boards.component';
import { AddBoardComponent } from './components/add-board/add-board.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, title: 'Home' },
  { path: 'all-users', component: AllUsersComponent, title: 'All Users' },
  { path: 'user-profile/:id', component: UserProfileComponent, title: 'User Profile' },
  { path: 'add-user', component: AddUserComponent, title: 'Add User' },
  { path: 'login', component: LoginComponent, title: 'Login'},
  { path: 'signup', component: SignupComponent, title: 'Signup'},
  { path: 'all-games', component: AllGamesComponent, title: 'All Games'},
  { path: 'add-game', component: AddGameComponent, title: 'Add Game'},
  { path: 'all-achievements', component: AllAchievementsComponent, title: 'All Achievements'},
  { path: 'add-achievement', component: AddAchievementComponent, title: 'Add Achievement'},
  { path: 'all-boards', component: AllBoardsComponent, title: 'All Boards'},
  { path: 'add-board', component: AddBoardComponent, title: 'Add Board'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
