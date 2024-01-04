import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Thread } from 'src/app/models/thread.model';
import { ThreadService } from 'src/app/services/thread.service';
import { Board } from 'src/app/models/board.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddThreadComponent } from '../threads/add-thread/add-thread.component';
import { User } from 'src/app/models/user.model';
import { PopUpComponent } from 'src/app/components/pop-up/pop-up.component';
import { lastValueFrom } from 'rxjs';
import { UserThread } from 'src/app/models/userThread.model';
import { UserThreadService } from 'src/app/services/userThread.service';
import { UserService } from 'src/app/services/user.service';

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
    private userThreadService: UserThreadService,
    private userService: UserService,
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
    boardID: new FormControl(0)
  });

  allThreads: Thread[];
  loadingThreads: boolean = false;
  board: any;
  user: User;
  userName: any;
  userThreads: UserThread[];
  userThreadsLoaded: boolean = false;

  async ngOnInit() {
    await this.checkCurrentUser();
    await this.loadBoardThreads();
    await this.loadAllUserThreads();
  }

  async checkCurrentUser(){
    let data: any = this.location.getState();
    this.board = data.board;
    if(data.user !== undefined && data.user !== null){
      this.user = data.user;
    } else {
      this.userName = localStorage.getItem('userName') ? localStorage.getItem('userName') : '';
      this.user = await lastValueFrom(this.userService.getUserByName(this.userName).pipe());
    }
    
  }

  async loadBoardThreads(){
    if (this.board !== null && this.board !== undefined && this.board.boardID !== undefined && this.board.boardID !== null) {
      this.boardSearchCriteria.controls.boardID.patchValue(this.board.boardID);
      this.loadingThreads = true;
      this.threadService.getAll(this.boardSearchCriteria.value).subscribe({
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

  async handleSearchResponse(result: any) {
    if (result !== null) {
      this.allThreads = result.data;
      if(!this.userThreadsLoaded){
        await this.loadAllUserThreads();
      } else {
        this.checkThreads();
      }
    } else {
      this.allThreads = [];
    }
    
  }

  public handleDeleteResponse(data:any){
    if(data == null){
      this.clearBoardSearch();
    } else {
      this.clearBoardSearch();
    }
  }

  handleErrorResponse(error: any) {
    this.snackBar.open(`Error ${error} loading threads.`, 'dismiss', {
      duration: 3000
    });
    this.allThreads = [];
  }

  applyBoardSearch() {
    this.threadService.getAll(this.boardSearchCriteria.value).subscribe({
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
      this.threadService.getAll(this.boardSearchCriteria.value).subscribe({
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
    let newUserThread: UserThread = {
      userThreadID: 0,
      threadID: thread.threadID,
      threadName: thread.threadName,
      boardName: thread.boardName,
      boardID: thread.boardID,
      userID: this.user.userID,
      createdAt: '',
      updatedAt: ''
    };
    this.userThreadService.create(newUserThread).subscribe({
      next: this.handleFollowResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

  handleFollowResponse(data: any){
    if(data !== null){
      this.snackBar.open('Successfully followed a thread!', 'dismiss',{
        duration: 3000
      });
      this.ngOnInit();
    }
  }

  async unfollowThread(thread: Thread){
    if(!this.userThreadsLoaded){
      await this.loadAllUserThreads();
    }
    let userThread = this.userThreads.find(obj => obj.threadID == thread.threadID);
    if(userThread !== undefined){
      this.userThreadService.delete(userThread?.userThreadID).subscribe({
        next: this.handleUnfollowResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    } else {
      this.snackBar.open('Unfollow was not successful: User Thread was undefined.', 'dismiss',{
        duration: 3000
      });
    }
  }

  handleUnfollowResponse(data: any){
    if(data == null){
      this.snackBar.open('Successfully unfollowed a thread!', 'dismiss',{
        duration: 3000
      });
      this.ngOnInit();
    } else {
      this.ngOnInit();
    }
  }

  openThread(thread: Thread) {
    this.router.navigate([`/thread/${thread.threadID}`], { state: { thread } });
  }

  editThread(thread: Thread){
    const dialogRefAdd = this.matDialog.open(AddThreadComponent, {
      width: '100%',
      disableClose: true,
      data: {
        board: this.board,
        isEdit: true,
        element: thread
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

  deleteThread(thread: Thread){
    const dialogRefDelete = this.matDialog.open(PopUpComponent, {
      width: '100%',
      disableClose: true,
      data: {
        element: thread,
        model: 'thread'
      }
    });

    dialogRefDelete.afterClosed().subscribe(result => {
      if(result.event === 'delete'){
        this.threadService.delete(thread.threadID).subscribe({
          next: this.handleDeleteResponse.bind(this),
          error: this.handleErrorResponse.bind(this)
        });
        this.snackBar.open(`${thread.threadName} has been deleted.`, 'dismiss',{
          duration: 3000
        });
      } else {
        this.snackBar.open(`${thread.threadName} has not been deleted.`, 'dismiss',{
          duration: 3000
        });
      }
    });
  }

  async loadAllUserThreads(){
    try {
      let userThreadSearchCriteria = {
        threadSearchTerm: '',
        sort: 'userThreadID',
        pagination: 'false',
        direction: 'asc',
        limit: 5,
        page: 0,
        userID: this.user.userID
      }
      let result = await lastValueFrom(this.userThreadService.getAll(userThreadSearchCriteria).pipe());
      if(result != null && result != undefined && result.message == undefined){
        this.userThreads = result.data;
        this.checkThreads();
        this.userThreadsLoaded = true;
      } else {
        this.userThreads = [];
        this.userThreadsLoaded = true;
      }
    } catch (err) {
      this.snackBar.open('Error loading user threads!', 'dismiss', {
        duration: 3000
      });
      console.log(err)
    }
  }

  checkThreads(){
    for(let thread of this.allThreads){
      let match = this.userThreads.find(obj => obj.threadID == thread.threadID);
      if(match !== undefined && match !== null){
        thread.isFollowing = true;
      } else {
        thread.isFollowing = false;
      }
    }
  }
}
