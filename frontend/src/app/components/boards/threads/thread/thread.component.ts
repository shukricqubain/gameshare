import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Thread } from 'src/app/models/thread.model';
import { Location } from '@angular/common';
import { ThreadItem } from 'src/app/models/threadItem.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
    //private threadItemService: ThreadItemService,
    private matDialog: MatDialog,
  ) {
  }

  threadSearchCriteria = new FormGroup({
    searchTerm: new FormControl(''),
    sort: new FormControl('threadID', [Validators.required]),
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
      this.threadSearchCriteria.controls.threadID.patchValue(this.thread.threadID);
      this.loadingThreadItems = true;
      // this.threadItemService.getAllByThreadID(this.threadSearchCriteria.value).subscribe({
      //   next: this.handleSearchResponse.bind(this),
      //   error: this.handleErrorResponse.bind(this)
      // });
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
    console.log('thread search')
    // this.threadItemService.getAllByThreadID(this.threadSearchCriteria.value).subscribe({
    //   next: this.handleSearchResponse.bind(this),
    //   error: this.handleErrorResponse.bind(this)
    // });
  }

  clearThreadSearch() {
    if (this.thread !== null && this.thread !== undefined && this.thread.threadID !== undefined && this.thread.threadID !== null) {
      this.threadSearchCriteria.controls.searchTerm.patchValue('');
      this.threadSearchCriteria.controls.sort.patchValue('threadID');
      this.threadSearchCriteria.controls.pagination.patchValue('true');
      this.threadSearchCriteria.controls.direction.patchValue('asc');
      this.threadSearchCriteria.controls.limit.patchValue(5);
      this.threadSearchCriteria.controls.page.patchValue(0);
      this.threadSearchCriteria.controls.threadID.patchValue(this.thread.threadID);
      // this.threadItemService.getAllByThreadID(this.threadSearchCriteria.value).subscribe({
      //   next: this.handleSearchResponse.bind(this),
      //   error: this.handleErrorResponse.bind(this)
      // });
    } else {
      this.snackBar.open(`Error clearing search, thread undefined.`, 'dismiss', {
        duration: 3000
      });
    }
  }

  addThreadItem() {
    console.log('post item')
    // const dialogRefAdd = this.matDialog.open(AddThreadItemComponent, {
    //   width: '100%',
    //   disableClose: true,
    //   data: {
    //     thread: this.thread,
    //     isEdit: false
    //   }
    // });

    // dialogRefAdd.afterClosed().subscribe(result => {
    //   if (result !== undefined) {
    //     this.clearBoardSearch();
    //   } else {
    //     this.clearBoardSearch();
    //   }
    // });
  }

  replyToThreadItem(threadItem: ThreadItem){
    console.log('reply')
  }

  saveThread(thread: Thread) {
    console.log(thread)
  }

  openThread(thread: Thread) {
    console.log(thread)
    this.router.navigate([`/thread/${thread.threadID}`], { state: { thread } });
  }
}
