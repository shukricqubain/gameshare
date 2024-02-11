import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/models/user.model';
import { UserFriend } from 'src/app/models/userFriend.model';
import { DateFunctionsService } from 'src/app/services/dateFunctions.service';
import { UserFriendService } from 'src/app/services/userFriend.service';
import { PopUpComponent } from 'src/app/components/pop-up/pop-up.component';
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

  profilePicture: string = '';

  async ngOnInit() {
    await this.loadUserFriendProfilePicture();
  }

  updateFriendStatus($event: any, userFriend: UserFriend) {
    let updatedUserFriend = {
      userFriendID: userFriend.userFriendID,
      userIDReceivedRequest: userFriend.userIDReceivedRequest,
      userIDSentRequest: userFriend.userIDSentRequest,
      areFriends: $event,
      createdBy: userFriend.createdBy,
      updatedBy: this.currentUser.userID,
      createdAt: userFriend.createdAt
    }
    this.userFriendService.update(updatedUserFriend).subscribe({
      next: this.handleUpdateResponse.bind(this),
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
          next: this.handleDeleteResponse.bind(this),
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

  public handleDeleteResponse(data: any) {
    if (data != null) {
      this.loadFriendEvent.next('loadFriendEvent');
    }
  }

  public handleUpdateResponse(data: any) {
    if (data != null) {
      this.loadFriendEvent.next('loadFriendEvent');
    }
  }

  viewUserProfile(element: any) {
    if (element.userIDSentRequest == this.currentUser.userID) {
      this.router.navigate([`/view-user-profile/${element.userIDReceivedRequest}`],
        {
          state: {
            userID: element.userIDReceivedRequest
          }
        });
    } else if (element.userIDReceivedRequest == this.currentUser.userID) {
      this.router.navigate([`/view-user-profile/${element.userIDSentRequest}`],
        {
          state: {
            userID: element.userIDSentRequest
          }
        });
    } else {
      this.snackBar.open(`Both sentID ${element.userIDSentRequest} and receivedID ${element.userIDReceivedRequest} not matching current user.`, 'dismiss', {
        duration: 3000
      });
    }
  }

  async loadUserFriendProfilePicture() {
    if (this.userFriend.userIDSentRequest == this.currentUser.userID) {
      try {
        let result = await lastValueFrom(this.userService.get(this.userFriend.userIDReceivedRequest).pipe());
        if(result != undefined && result != null && result.profilePicture != undefined && result.profilePicture != null){
          this.profilePicture = result.profilePicture;
        } else {
          this.snackBar.open(`Error loading profile picture for ${this.userFriend.ReceivedBy}`, 'dismiss', {
            duration: 3000
          });
        }
      } catch (err) {
        this.snackBar.open(`Error loading profile picture for ${this.userFriend.ReceivedBy}`, 'dismiss', {
          duration: 3000
        });
      }
    } else if (this.userFriend.userIDReceivedRequest == this.currentUser.userID) {
      try {
        let result = await lastValueFrom(this.userService.get(this.userFriend.userIDSentRequest).pipe());
        if(result != undefined && result != null && result.profilePicture != undefined && result.profilePicture != null){
          this.profilePicture = result.profilePicture;
        } else {
          this.snackBar.open(`Error loading profile picture for ${this.userFriend.ReceivedBy}`, 'dismiss', {
            duration: 3000
          });
        }
      } catch (err) {
        this.snackBar.open(`Error loading profile picture for ${this.userFriend.SentBy}`, 'dismiss', {
          duration: 3000
        });
      }
    } else {
      this.snackBar.open(`Both sentID ${this.userFriend.userIDSentRequest} and receivedID ${this.userFriend.userIDReceivedRequest} not matching current user.`, 'dismiss', {
        duration: 3000
      });
    }
  }
}
