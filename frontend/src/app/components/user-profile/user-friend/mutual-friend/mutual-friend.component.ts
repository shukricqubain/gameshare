import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mutual-friend',
  templateUrl: './mutual-friend.component.html',
  styleUrls: ['./mutual-friend.component.css']
})
export class MutualFriendComponent {

  @Input() mutualFriend: any;

  constructor(
    private snackBar: MatSnackBar,
    private matDialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit(){
  }

  viewUserProfile() {
    this.router.navigate([`/view-user-profile/${this.mutualFriend.userID}`],
      {
        state: {
          userID: this.mutualFriend.userID
        }
      });
  }

}
