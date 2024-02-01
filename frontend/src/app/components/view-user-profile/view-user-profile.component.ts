import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service';
import { Location } from '@angular/common';
import { User } from 'src/app/models/user.model';
import { lastValueFrom } from 'rxjs';
import { DateFunctionsService } from 'src/app/services/dateFunctions.service';
import { UserFriend } from 'src/app/models/userFriend.model';
import { UserFriendService } from 'src/app/services/userFriend.service';

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
    private userFriendService: UserFriendService
  ){}

  userLoaded: boolean = false;
  currentUserLoaded: boolean = false;
  viewedUser: User;
  currentUser: User;
  requestSent: boolean = false;
  alreadyChecked: boolean = false;
  buttonMessage: string = 'Send Friend Request';

  async ngAfterViewInit(){
    let data: any = this.location.getState();
    let userName: any = localStorage.getItem('userName');
    await this.loadCurrentUser(userName);
    await this.loadUserToView(data);
    await this.checkFriendRequestSent();
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
    console.log('send invite')
    let newFriend: UserFriend = {
      userIDSentRequest: 0,
      userIDReceivedRequest: 0,
      areFriends: 0,
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
    this.snackBar.open(`Successfully sent friend request.`, 'dismiss', {
      duration: 3000
    });
  }

  handleErrorResponse(data: any){
    console.log(data)
    this.snackBar.open(`Error occured while sending friend request.`, 'dismiss', {
      duration: 3000
    });
  }

  async checkFriendRequestSent(){
    try {
      if(!this.alreadyChecked){
        let userIDSentRequest = this.currentUser.userID;
        let userIDReceivedRequest = this.viewedUser.userID;
        let result = await lastValueFrom(this.userFriendService.getByUserSentAndUserReceivedIDs({userIDSentRequest,userIDReceivedRequest}).pipe());
        if(result != undefined){
          if(result.areFriends){
            this.buttonMessage = 'Already Friends'
          } else {
            this.buttonMessage = 'Request Already Sent'
          }
          this.requestSent = true;
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

}
