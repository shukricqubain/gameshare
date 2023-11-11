import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Thread } from 'src/app/models/thread.model';
import { lastValueFrom } from 'rxjs';
import { ThreadService } from 'src/app/services/thread.service';
import { Board } from 'src/app/models/board.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddThreadComponent } from '../threads/add-thread/add-thread.component';

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
    private threadService: ThreadService,
    private matDialog: MatDialog,
  ) {
  }

  boardSearchCriteria = new FormGroup({
    searchTerm: new FormControl(''),
    sort: new FormControl('boardID', [Validators.required]),
    pagination: new FormControl('false', [Validators.required]),
    direction: new FormControl('asc', [Validators.required]),
    limit: new FormControl(5, [Validators.required]),
    page: new FormControl(0, [Validators.required]),
    boardID: new FormControl(0, [])
  });

  allThreads: Thread[];
  loadingThreads: boolean = false;
  board: any;


  async ngOnInit() {
    let data: any = this.location.getState();
    this.board = data.board;
    if (this.board !== null && this.board !== undefined && this.board.boardID !== undefined && this.board.boardID !== null) {
      this.boardSearchCriteria.controls.boardID.patchValue(this.board.boardID);
      this.loadingThreads = true;
      this.threadService.getAllByBoardID(this.boardSearchCriteria.value).subscribe({
        next: this.handleSearchResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
      this.loadingThreads = false;
    } else {
      this.snackBar.open(`Error loading board.`, 'dismiss', {
        duration: 3000
      });
    }
  }

  handleSearchResponse(result: any) {
    if (result !== null) {
      this.allThreads = result.data;
    } else {
      this.allThreads = [];
    }
  }

  handleErrorResponse(error: any) {
    this.snackBar.open(`Error ${error} loading threads.`, 'dismiss', {
      duration: 3000
    });
    this.allThreads = [];
  }

  applyBoardSearch() {
    this.threadService.getAllByBoardID(this.boardSearchCriteria.value).subscribe({
      next: this.handleSearchResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

  clearBoardSearch() {
    if (this.board !== null && this.board !== undefined && this.board.boardID !== undefined && this.board.boardID !== null) {
      this.boardSearchCriteria.controls.searchTerm.patchValue('');
      this.boardSearchCriteria.controls.sort.patchValue('boardID');
      this.boardSearchCriteria.controls.pagination.patchValue('true');
      this.boardSearchCriteria.controls.direction.patchValue('asc');
      this.boardSearchCriteria.controls.limit.patchValue(5);
      this.boardSearchCriteria.controls.page.patchValue(0);
      this.boardSearchCriteria.controls.boardID.patchValue(this.board.boardID);
      this.threadService.getAllByBoardID(this.boardSearchCriteria.value).subscribe({
        next: this.handleSearchResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    } else {
      this.snackBar.open(`Error clearing search, board undefined.`, 'dismiss', {
        duration: 3000
      });
    }
  }

  addThread() {
    const dialogRefAdd = this.matDialog.open(AddThreadComponent, {
      width: '100%',
      disableClose: true,
      data: {
        board: this.board,
        isEdit: false
      }
    });

    dialogRefAdd.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.clearBoardSearch();
      } else {
        this.clearBoardSearch();
      }
    });
  }

  saveThread(thread: Thread) {
    console.log(thread)
  }

  openThread(thread: Thread) {
    console.log(thread)
    this.router.navigate([`/thread/${thread.threadID}`], { state: { thread } });
  }
}
