import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GameInfoComponent } from 'src/app/components/games/game-info/game-info.component';
import { Game } from 'src/app/models/game.model';
import { UserGame } from 'src/app/models/userGame.model';
import { AddUserGameComponent } from '../add-user-game/add-user-game.component';
import { UserGameService } from 'src/app/services/userGame.service';
import { PopUpComponent } from 'src/app/components/pop-up/pop-up.component';

@Component({
  selector: 'app-user-game',
  templateUrl: './user-game.component.html',
  styleUrls: ['./user-game.component.css']
})
export class UserGameComponent {

  @Input() userGame: UserGame;
  @Output() loadGameEvent = new EventEmitter<string>();

  constructor(
    private matDialog: MatDialog,
    private snackBar: MatSnackBar,
    private userGameService: UserGameService
  ){
  }

  ngOnInit(){
  }

  gameInfoPopup(userGame: UserGame) {
    const dialogRefAdd = this.matDialog.open(GameInfoComponent, {
      disableClose: false,
      height: '80vh',
      data: {
        userGame
      }
    });

    dialogRefAdd.afterClosed().subscribe(result => {
    });
  }

  editUserGame(userGame: UserGame) {
    const dialogRef = this.matDialog.open(AddUserGameComponent, {
      width: '100%',
      disableClose: true,
      data: {
        isEdit: true,
        element: userGame
      }
    });

    dialogRef.afterClosed().subscribe(async result => {
      let event = result.event;
      if (result != undefined && event != undefined && event !== 'Cancel') {
        this.loadGameEvent.next('loadGame');
      }
    });
  }

  deleteUserGame(userGame: UserGame) {
    const dialogRefDelete = this.matDialog.open(PopUpComponent, {
      width: '100%',
      disableClose: true,
      data: {
        element: userGame,
        model: 'userGame'
      }
    });

    dialogRefDelete.afterClosed().subscribe(result => {
      if (result.event === 'delete') {
        this.userGameService.delete(userGame.userGameID).subscribe({
          next: this.handleGameDeleteResponse.bind(this),
          error: this.handleErrorResponse.bind(this)
        });
        this.snackBar.open(`${userGame.gameName} has been deleted.`, 'dismiss', {
          duration: 3000
        });
      } else {
        this.snackBar.open(`${userGame.gameName} has not been deleted.`, 'dismiss', {
          duration: 3000
        });
      }
    });
  }

  public async handleGameDeleteResponse(data: any) {
    if (data !== null) {
      this.loadGameEvent.next('loadGame');
    }
  }

  handleErrorResponse(data: any) {
    this.snackBar.open(data.message, 'dismiss', {
      duration: 2000
    });
  }
}
