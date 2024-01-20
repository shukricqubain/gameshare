import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Board } from 'src/app/models/board.model';
import { UserBoard } from 'src/app/models/userBoard.model';
import { UserBoardService } from 'src/app/services/userBoard.service';

@Component({
  selector: 'app-user-board',
  templateUrl: './user-board.component.html',
  styleUrls: ['./user-board.component.css']
})
export class UserBoardComponent {

  @Input() userBoard: UserBoard;
  @Output() unfollowBoardEvent = new EventEmitter<string>();

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private userBoardService: UserBoardService
  ){
  }

  ngOnInit(){
  }

  openBoard(board: Board) {
    this.router.navigate([`/board/${board.boardID}`], { state: { board: board } });
  }

  async unfollowBoard(userBoard: UserBoard) {
    if (userBoard !== undefined) {
      this.userBoardService.delete(userBoard?.userBoardID).subscribe({
        next: this.handleUnfollowResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
      this.snackBar.open('Successfully unfollowed a board!', 'dismiss', {
        duration: 3000
      });
    } else {
      this.snackBar.open('Unfollow was not successful: User Board was undefined.', 'dismiss', {
        duration: 3000
      });
    }
  }

  async handleUnfollowResponse(data: any) {
    if (data !== null) {
      this.unfollowBoardEvent.next('unfollowedBoard');
    }
  }

  handleErrorResponse(data: any) {
    this.snackBar.open(data.message, 'dismiss', {
      duration: 2000
    });
  }
}
