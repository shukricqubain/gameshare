import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { AllUsersComponent } from './components/all-users/all-users.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, title: 'Home' },
  { path: 'all-users', component: AllUsersComponent, title: 'All Users' },
  { path: 'user-profile/:id', component: UserProfileComponent, title: 'User Profile' },
  { path: 'add-user', component: AddUserComponent, title: 'Add User' },
  { path: 'login', component: LoginComponent, title: 'Login'},
  { path: 'signup', component: SignupComponent, title: 'Signup'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
