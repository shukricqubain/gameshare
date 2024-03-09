import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service';
import { Location } from '@angular/common';
import { User } from 'src/app/models/user.model';
import { lastValueFrom } from 'rxjs';
import { DateFunctionsService } from 'src/app/services/dateFunctions.service';
import { UserFriend } from 'src/app/models/userFriend.model';
import { UserFriendService } from 'src/app/services/userFriend.service';
import { UserGameService } from 'src/app/services/userGame.service';
import { UserGame } from 'src/app/models/userGame.model';
import { UserHighlightService } from 'src/app/services/userHighlight.service';
import { Game } from 'src/app/models/game.model';
import { GameInfoComponent } from '../games/game-info/game-info.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-view-user-profile',
  templateUrl: './view-user-profile.component.html',
  styleUrls: ['./view-user-profile.component.css']
})
export class ViewUserProfileComponent {

  constructor(
    private location: Location,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private dateFunction: DateFunctionsService,
    private userFriendService: UserFriendService,
    private userHighlightService: UserHighlightService,
    private matDialog: MatDialog,
  ){}

  userLoaded: boolean = false;
  currentUserLoaded: boolean = false;
  viewedUser: User;
  currentUser: User;
  requestSent: boolean = false;
  alreadyChecked: boolean = false;
  buttonMessage: string = 'Send Friend Request';
  userHighlightsLoaded: boolean = false;
  userHighlights: any[] = [];
  gameContent: string = '';

  /* progress bar */
  color: '#673ab7';
  mode: 'determinate';

  async ngAfterViewInit(){
    let data: any = this.location.getState();
    let userName: any = localStorage.getItem('userName');
    await this.loadCurrentUser(userName);
    await this.loadUserToView(data);
    await this.checkFriendStatus();
    await this.loadUserHighlights();
  }

  async loadUserHighlights(){
    try {
      if(!this.userHighlightsLoaded){
        let userID = this.viewedUser.userID ? this.viewedUser.userID : 0;
        if(userID != 0) {
          let result = await lastValueFrom(this.userHighlightService.getUserHighlights(userID).pipe());
          console.log(result)
          if(result !== 'Cannot find userHighlights with specified userID'){
            this.userHighlights = result;
          } else {
            this.gameContent = 'No recent gaming activity.';
          }
          this.userHighlightsLoaded = true;
        }
        
      }
    } catch(err){
      console.error(err);
      this.userHighlightsLoaded = true;
      this.snackBar.open('Error loading user highlights.', 'dismiss', {
        duration: 2000
      });
    }
  }

  async loadUserToView(data: any){
    try {
      if(!this.userLoaded){
        let result = await lastValueFrom(this.userService.get(data.userID).pipe());
        if(result != undefined){
          this.viewedUser = result;
          this.userLoaded = true;
        } else {
          this.userLoaded = true;
          this.snackBar.open('User details return undefined.', 'dismiss', {
            duration: 2000
          });
        }
      }
    } catch(err){
      console.error(err);
      this.userLoaded = true;
      this.snackBar.open('Error loading user details.', 'dismiss', {
        duration: 2000
      });
    }
  }

  async loadCurrentUser(userName: string){
    try {
      if(!this.currentUserLoaded){
        let result = await lastValueFrom(this.userService.getUserByName(userName).pipe());
        if(result != undefined){
          this.currentUser = result;
          this.currentUserLoaded = true;
        } else {
          this.currentUserLoaded = true;
          this.snackBar.open('Current user details return undefined.', 'dismiss', {
            duration: 2000
          });
        }
      }
    } catch(err){
      console.error(err);
      this.currentUserLoaded = true;
      this.snackBar.open('Error loading current user details.', 'dismiss', {
        duration: 2000
      });
    }
  }

  public formatDate(date: any) {
    let formattedDate = this.dateFunction.formatDateMMDDYYYY(date);
    return formattedDate;
  }

  sendFriendRequest(){
    let newFriend: UserFriend = {
      userIDSentRequest: 0,
      userIDReceivedRequest: 0,
      areFriends: 'pending',
      createdBy: 0,
      updatedBy: 0,
      createdAt: '',
      updatedAt: ''
    }
    if(this.currentUserLoaded && this.currentUser != undefined){
      newFriend.userIDSentRequest = this.currentUser.userID;
      newFriend.createdBy = this.currentUser.userID;
    }
    if(this.userLoaded && this.viewedUser != undefined){
      newFriend.userIDReceivedRequest = this.viewedUser.userID;
    }
    this.userFriendService.create(newFriend).subscribe({
      next: this.handleCreateUserFriend.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

  handleCreateUserFriend(data: any){
    this.requestSent = true;
    this.alreadyChecked = true;
    this.snackBar.open(`Successfully sent friend request.`, 'dismiss', {
      duration: 3000
    });
  }

  handleErrorResponse(data: any){
    this.snackBar.open(`Error occured while sending friend request.`, 'dismiss', {
      duration: 3000
    });
  }

  async checkFriendStatus(){
    try {
      if(!this.alreadyChecked){
        let userIDOne = this.currentUser.userID;
        let userIDTwo = this.viewedUser.userID;
        let result = await lastValueFrom(this.userFriendService.getByUserSentAndUserReceivedIDs({userIDOne,userIDTwo}).pipe());
        if(result != undefined && result.message == undefined){
          if(result.areFriends === 'accepted'){
            this.buttonMessage = 'Already Friends'
          } else {
            this.buttonMessage = 'Request Already Sent'
          }
          this.requestSent = true;
          this.alreadyChecked = true;
        } else if (result != undefined && result.message != undefined){
          this.requestSent = false;
          this.alreadyChecked = true;
        } else {
          this.alreadyChecked = true;
          this.snackBar.open('Friend request details returned undefined.', 'dismiss', {
            duration: 2000
          });
        }
      }
    } catch(err){
      console.error(err);
      this.currentUserLoaded = true;
      this.snackBar.open('Error loading friend request status.', 'dismiss', {
        duration: 2000
      });
    }
  }

  gameInfoPopup(game: Game) {
    const dialogRefAdd = this.matDialog.open(GameInfoComponent, {
      disableClose: false,
      height: '80vh',
      data: {
        game
      }
    });

    dialogRefAdd.afterClosed().subscribe(result => {
    });
  }
  
}
