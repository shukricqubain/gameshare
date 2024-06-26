import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AddUserComponent } from './components/users/add-user/add-user.component';
import { AllUsersComponent } from './components/users/all-users/all-users.component';
import { HeaderComponent } from './components/header/header.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { LoginComponent } from './components/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { PopUpComponent } from './components/reusable/pop-up/pop-up.component';
import { SignupComponent } from './components/signup/signup.component';
import { AddGameComponent } from './components/games/add-game/add-game.component';
import { AllGamesComponent } from './components/games/all-games/all-games.component';
import { AddAchievementComponent } from './components/achievements/add-achievement/add-achievement.component';
import { AllAchievementsComponent } from './components/achievements/all-achievements/all-achievements.component';
import { AddUserGameComponent } from './components/user-profile/user-game/add-user-game/add-user-game.component';
import { AddUserAchievementComponent } from './components/user-profile/user-achievement/add-user-achievement/add-user-achievement.component';
import { AddBoardComponent } from './components/boards/add-board/add-board.component';
import { AllBoardsComponent } from './components/boards/all-boards/all-boards.component';
import { AddThreadComponent } from './components/boards/threads/add-thread/add-thread.component';
import { AllThreadsComponent } from './components/boards/threads/all-threads/all-threads.component';
import { BoardsComponent } from './components/boards/boards.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { BoardComponent } from './components/boards/board/board.component';
import { ThreadComponent } from './components/boards/threads/thread/thread.component';
import { AddThreadItemComponent } from './components/boards/threads/thread/add-thread-item/add-thread-item.component';
import { AddUserBoardComponent } from './components/user-profile/user-board/add-user-board/add-user-board.component';
import { AddUserThreadComponent } from './components/user-profile/user-thread/add-user-thread/add-user-thread.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { GameInfoComponent } from './components/games/game-info/game-info.component';
import { FilterFormPopUpComponent } from './components/filter-form-pop-up/filter-form-pop-up.component';
import { UserAchievementComponent } from './components/user-profile/user-achievement/user-achievement/user-achievement.component';
import { UserBoardComponent } from './components/user-profile/user-board/user-board/user-board.component';
import { UserGameComponent } from './components/user-profile/user-game/user-game/user-game.component';
import { UserThreadComponent } from './components/user-profile/user-thread/user-thread/user-thread.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ProfilePicturePopUpComponent } from './components/user-profile/profile-picture-pop-up/profile-picture-pop-up.component';
import { ViewUserProfileComponent } from './components/view-user-profile/view-user-profile.component';
import { UserFriendComponent } from './components/user-profile/user-friend/user-friend/user-friend.component';
import { MutualFriendComponent } from './components/user-profile/user-friend/mutual-friend/mutual-friend.component';
import { UserChatComponent } from './components/user-profile/user-chat/user-chat/user-chat.component';
import { AddUserChatComponent } from './components/user-profile/user-chat/add-user-chat/add-user-chat.component';
import { UserMessageComponent } from './components/user-profile/user-chat/user-message/user-message.component';
import { ImageUploadComponent } from './components/reusable/image-upload/image-upload.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GhostComponent } from './components/ghost/ghost/ghost.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './auth/auth.service';
import { AuthInterceptor } from './auth/auth-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AddUserComponent,
    AllUsersComponent,
    HeaderComponent,
    UserProfileComponent,
    LoginComponent,
    PopUpComponent,
    SignupComponent,
    AddGameComponent,
    AllGamesComponent,
    AddAchievementComponent,
    AllAchievementsComponent,
    AddUserGameComponent,
    AddUserAchievementComponent,
    AddBoardComponent,
    AllBoardsComponent,
    AddThreadComponent,
    AllThreadsComponent,
    BoardsComponent,
    BoardComponent,
    ThreadComponent,
    AddThreadItemComponent,
    AddUserBoardComponent,
    AddUserThreadComponent,
    GameInfoComponent,
    FilterFormPopUpComponent,
    UserAchievementComponent,
    UserBoardComponent,
    UserGameComponent,
    UserThreadComponent,
    ProfilePicturePopUpComponent,
    ViewUserProfileComponent,
    UserFriendComponent,
    MutualFriendComponent,
    UserChatComponent,
    AddUserChatComponent,
    UserMessageComponent,
    ImageUploadComponent,
    GhostComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    HttpClientModule,
    MatPaginatorModule,
    MatTableModule,
    MatTooltipModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatRippleModule,
    MatInputModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSlideToggleModule,
    FormsModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatMenuModule,
    MatTabsModule,
    MatSelectModule,
    MatExpansionModule,
    NgxMaskDirective,
    NgxMaskPipe,
    MatButtonToggleModule,
    MatProgressBarModule,
    FlexLayoutModule
  ],
  exports: [
    MatButtonModule,
    MatFormFieldModule,
    MatRippleModule,
    MatInputModule,
    MatSnackBarModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatMenuModule,
    MatTabsModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatProgressBarModule
  ],
  providers: [
    MatDatepickerModule,
    provideNgxMask(),
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
