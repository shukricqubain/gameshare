import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/models/user.model';
import { UserFriend } from 'src/app/models/userFriend.model';
import { DateFunctionsService } from 'src/app/services/dateFunctions.service';
import { UserFriendService } from 'src/app/services/userFriend.service';
import { PopUpComponent } from 'src/app/components/reusable/pop-up/pop-up.component';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-user-friend',
  templateUrl: './user-friend.component.html',
  styleUrls: ['./user-friend.component.css']
})
export class UserFriendComponent {

  @Input() userFriend: UserFriend;
  @Input() currentUser: User;
  @Output() loadFriendEvent = new EventEmitter<string>();

  constructor(
    private snackBar: MatSnackBar,
    private userFriendService: UserFriendService,
    private dateFunction: DateFunctionsService,
    private userService: UserService,
    private matDialog: MatDialog,
    private router: Router,
  ) { }

  profilePictureFileName: string = '';
  mutualFriends: any[] = [];
  titleString: string = '';
  titleUserName: string = '';
  dateString: string = '';
  subtitleString: string = '';
  subtitleUserName: string = '';
  actionsDisplay: string = '';

  async ngOnInit() {
    this.prepareUserFriend();
  }

  prepareUserFriend(){
    if(this.userFriend.mutualFriends && typeof this.userFriend.mutualFriends !== 'string'){
      this.mutualFriends = this.userFriend.mutualFriends;
    } else {
      this.mutualFriends = [];
    }
    if(this.userFriend.userIDSentRequest == this.currentUser.userID){
      this.titleUserName = `${this.userFriend.receivedByUserName}`;
      this.dateString = 'Sent Date:';
      this.subtitleString = 'Sent By:';      
      this.subtitleUserName = `${this.userFriend.sentByUserName}`;
      this.actionsDisplay = 'sent';
      this.profilePictureFileName = this.userFriend.receivedByProfilePictureFileName ? this.userFriend.receivedByProfilePictureFileName : '';
      switch (this.userFriend.areFriends){
        case ('accepted'):
          this.actionsDisplay = 'hide';
          this.titleString = '';
          break;
        case ('pending'):
          this.titleString = 'Friend Request Sent to';
          break;
        case ('rejected'):
          this.actionsDisplay = 'hide';
          this.titleString = 'Request rejected by';
      }
    } else {
      this.titleUserName = `${this.userFriend.sentByUserName}`;
      this.dateString = 'Recieved Date:';
      this.subtitleString = 'Recieved By:';
      this.subtitleUserName = `${this.userFriend.receivedByUserName}`;
      this.actionsDisplay = 'received';
      this.profilePictureFileName = this.userFriend.sentByProfilePictureFileName ? this.userFriend.sentByProfilePictureFileName : '';
      switch (this.userFriend.areFriends){
        case ('accepted'):
          this.actionsDisplay = 'hide';
          this.titleString = '';
          break;
        case ('pending'):
        this.titleString = 'Friend Request Received from';
          break;
        case ('rejected'):
          this.actionsDisplay = 'hide';
          this.titleString = 'Rejected Request from';
      }
    }
  }

  updateFriendStatus(areFriends: string, userFriend: UserFriend) {
    let updatedUserFriend = {
      userFriendID: userFriend.userFriendID,
      userIDReceivedRequest: userFriend.userIDReceivedRequest,
      userIDSentRequest: userFriend.userIDSentRequest,
      areFriends: areFriends,
      createdBy: userFriend.createdBy,
      updatedBy: this.currentUser.userID,
      createdAt: userFriend.createdAt
    }
    this.userFriendService.update(updatedUserFriend).subscribe({
      next: this.handleUpdateResponse.bind(this, updatedUserFriend.areFriends),
      error: this.handleErrorResponse.bind(this)
    });
  }

  public formatDate(date: any) {
    let formattedDate = this.dateFunction.formatDateMMDDYYYY(date);
    return formattedDate;
  }

  public deleteFriendRequest(userFriend: UserFriend) {
    const dialogRefDelete = this.matDialog.open(PopUpComponent, {
      width: '100%',
      disableClose: true,
      data: {
        element: userFriend,
        model: 'userFriend'
      }
    });

    dialogRefDelete.afterClosed().subscribe(result => {
      if (result.event === 'delete') {
        this.userFriendService.delete(userFriend.userFriendID).subscribe({
          next: this.handleDeleteResponse.bind(this, userFriend.areFriends),
          error: this.handleErrorResponse.bind(this)
        });
        this.snackBar.open(`Friend request has been deleted.`, 'dismiss', {
          duration: 3000
        });
      } else {
        this.snackBar.open(`Friend request has not been deleted.`, 'dismiss', {
          duration: 3000
        });
      }
    });
  }

  public handleErrorResponse(data: any) {
    this.snackBar.open(data.message, 'dismiss', {
      duration: 2000
    });
  }

  public handleDeleteResponse(data: any, areFriends: string) {
    if (data != null) {
      this.loadFriendEvent.next('loadFriendEvent');
    }
  }

  public handleUpdateResponse(data: any, areFriends: string) {
    if (data != null) {
      this.loadFriendEvent.next('loadFriendEvent');
    }
  }

  viewUserProfile(element: any) {
    if (element.userIDSentRequest == this.currentUser.userID) {
      this.router.navigate([`/view-user-profile/${element.userIDReceivedRequest}`],
        {
          state: {
            userID: element.userIDReceivedRequest,
            userFriend: element
          }
        });
    } else if (element.userIDReceivedRequest == this.currentUser.userID) {
      this.router.navigate([`/view-user-profile/${element.userIDSentRequest}`],
        {
          state: {
            userID: element.userIDSentRequest,
            userFriend: element
          }
        });
    } else {
      this.snackBar.open(`Both sentID ${element.userIDSentRequest} and receivedID ${element.userIDReceivedRequest} not matching current user.`, 'dismiss', {
        duration: 3000
      });
    }
  }

  unfriendPopUp(userFriend: UserFriend){
    let otherUser: string;
    if(userFriend.userIDSentRequest == this.currentUser.userID){
      otherUser = userFriend.ReceivedBy?.userName ? userFriend.ReceivedBy?.userName : '';
    } else {
      otherUser = userFriend.SentBy?.userName ? userFriend.SentBy?.userName : '';
    }

    let updatedUserFriend: UserFriend = {
      userFriendID: userFriend.userFriendID,
      userIDSentRequest: userFriend.userIDSentRequest,
      userIDReceivedRequest: userFriend.userIDReceivedRequest,
      SentBy: userFriend.SentBy,
      ReceivedBy: userFriend.ReceivedBy,
      areFriends: 'rejected',
      createdBy: userFriend.createdBy,
      updatedBy: this.currentUser.userID,
      createdAt: userFriend.createdAt
    }

    const dialogRef = this.matDialog.open(PopUpComponent, {
      width: '100%',
      disableClose: true,
      data: {
        element: userFriend,
        model: 'userFriend'
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {

      if(result.event === 'delete'){
        this.userFriendService.update(updatedUserFriend).subscribe({
          next: this.handleUpdateResponse.bind(this, updatedUserFriend.areFriends),
          error: this.handleErrorResponse.bind(this)
        });
        this.snackBar.open(`You and ${otherUser} are no longer friends.`, 'dismiss',{
          duration: 3000
        });
      } else {
        this.snackBar.open(`Unfriending ${otherUser} was unsuccessful.`, 'dismiss',{
          duration: 3000
        });
      }
    });
  }
}
