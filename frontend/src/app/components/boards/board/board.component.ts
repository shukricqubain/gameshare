import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Thread } from 'src/app/models/thread.model';
import { lastValueFrom } from 'rxjs';
import { ThreadService } from 'src/app/services/thread.service';
import { Board } from 'src/app/models/board.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private location: Location,
    private threadService: ThreadService
  ) {
  }

  allThreads: Thread[];

  async ngOnInit() {
    let data: any = this.location.getState();
    await this.loadAllThreads(data.board);
  }

  async loadAllThreads(board: Board) {
    try {
      let searchCriteria = {
        searchTerm: `${board.boardID}`,
        sort: 'threadID',
        pagination: 'false',
        direction: 'asc',
        limit: 5,
        page: 0
      }
      let result = await lastValueFrom(this.threadService.getAll(searchCriteria).pipe());
      this.allThreads = result.data;
    } catch (err) {
      console.log(err);
      this.snackBar.open(`Error ${err} loading threads.`, 'dismiss', {
        duration: 3000
      });
    }

  }
}
