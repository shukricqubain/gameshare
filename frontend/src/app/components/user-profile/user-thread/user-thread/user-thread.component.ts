import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Thread } from 'src/app/models/thread.model';
import { UserThread } from 'src/app/models/userThread.model';
import { UserThreadService } from 'src/app/services/userThread.service';

@Component({
  selector: 'app-user-thread',
  templateUrl: './user-thread.component.html',
  styleUrls: ['./user-thread.component.css']
})
export class UserThreadComponent {

  @Input() userThread: UserThread;
  @Output() unfollowThreadEvent = new EventEmitter<string>();

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private userThreadService: UserThreadService,
  ){
  }

  ngOnInit(){
  }

  openThread(userThread: UserThread) {
    this.router.navigate([`/thread/${userThread.threadID}`], { state: { userThread } });
  }

  async unfollowThread(userThread: UserThread) {
    if (userThread !== undefined) {
      this.userThreadService.delete(userThread?.userThreadID).subscribe({
        next: this.handleUnfollowThreadResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
      this.snackBar.open('Successfully unfollowed a thread!', 'dismiss', {
        duration: 3000
      });
    } else {
      this.snackBar.open('Unfollow was not successful: User Thread was undefined.', 'dismiss', {
        duration: 3000
      });
    }
  }

  async handleUnfollowThreadResponse(data: any) {
    if (data !== null) {
      this.unfollowThreadEvent.next('unfollowedThread');
    }
  }

  handleErrorResponse(data: any) {
    this.snackBar.open(data.message, 'dismiss', {
      duration: 2000
    });
  }
}
