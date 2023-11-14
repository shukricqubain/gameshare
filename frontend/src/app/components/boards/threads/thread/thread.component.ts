import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Thread } from 'src/app/models/thread.model';
import { Location } from '@angular/common';
import { ThreadItem } from 'src/app/models/threadItem.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ThreadItemService } from 'src/app/services/threadItem.service';
import { AddThreadItemComponent } from './add-thread-item/add-thread-item.component';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.css']
})
export class ThreadComponent {
  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private location: Location,
    private threadItemService: ThreadItemService,
    private matDialog: MatDialog,
  ) {
  }

  threadItemSearchCriteria = new FormGroup({
    searchTerm: new FormControl(''),
    sort: new FormControl('threadItemID', [Validators.required]),
    pagination: new FormControl('false', [Validators.required]),
    direction: new FormControl('asc', [Validators.required]),
    limit: new FormControl(5, [Validators.required]),
    page: new FormControl(0, [Validators.required]),
    threadID: new FormControl(0, [])
  });

  allThreadItems: ThreadItem[];
  loadingThreadItems: boolean = false;
  thread: any;


  async ngOnInit() {
    let data: any = this.location.getState();
    this.thread = data.thread;
    if (this.thread !== null && this.thread !== undefined && this.thread.threadID !== undefined && this.thread.threadID !== null) {
      this.threadItemSearchCriteria.controls.threadID.patchValue(this.thread.threadID);
      this.loadingThreadItems = true;
      this.threadItemService.getAll(this.threadItemSearchCriteria.value).subscribe({
        next: this.handleSearchResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
      this.loadingThreadItems = false;
    } else {
      this.snackBar.open(`Error loading thread.`, 'dismiss', {
        duration: 3000
      });
    }
  }

  handleSearchResponse(result: any) {
    if (result !== null) {
      this.allThreadItems = result.data;
    } else {
      this.allThreadItems = [];
    }
  }

  handleErrorResponse(error: any) {
    this.snackBar.open(`Error ${error} loading threads.`, 'dismiss', {
      duration: 3000
    });
    this.allThreadItems = [];
  }

  applyThreadSearch() {
    this.threadItemService.getAll(this.threadItemSearchCriteria.value).subscribe({
      next: this.handleSearchResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

  clearThreadSearch() {
    if (this.thread !== null && this.thread !== undefined && this.thread.threadID !== undefined && this.thread.threadID !== null) {
      this.threadItemSearchCriteria.controls.searchTerm.patchValue('');
      this.threadItemSearchCriteria.controls.sort.patchValue('threadID');
      this.threadItemSearchCriteria.controls.pagination.patchValue('true');
      this.threadItemSearchCriteria.controls.direction.patchValue('asc');
      this.threadItemSearchCriteria.controls.limit.patchValue(5);
      this.threadItemSearchCriteria.controls.page.patchValue(0);
      this.threadItemSearchCriteria.controls.threadID.patchValue(this.thread.threadID);
      this.threadItemService.getAll(this.threadItemSearchCriteria.value).subscribe({
        next: this.handleSearchResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    } else {
      this.snackBar.open(`Error clearing search, thread undefined.`, 'dismiss', {
        duration: 3000
      });
    }
  }

  addThreadItem() {
    const dialogRefAdd = this.matDialog.open(AddThreadItemComponent, {
      width: '100%',
      disableClose: true,
      data: {
        thread: this.thread,
        isEdit: false
      }
    });

    dialogRefAdd.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.clearThreadSearch();
      } else {
        this.clearThreadSearch();
      }
    });
  }

  editThreadItem(element: any) {
    const dialogRefAdd = this.matDialog.open(AddThreadItemComponent, {
      width: '100%',
      disableClose: true,
      data: {
        thread: this.thread,
        isEdit: true,
        threadItem: element
      }
    });

    dialogRefAdd.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.clearThreadSearch();
      } else {
        this.clearThreadSearch();
      }
    });
  }

  replyToThreadItem(threadItem: ThreadItem){
    console.log('reply')
  }
}