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
import { UserService } from 'src/app/services/user.service';
import { lastValueFrom } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { PopUpComponent } from 'src/app/components/reusable/pop-up/pop-up.component';

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
    private userService: UserService
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
  finishedLoadingData: boolean = false;
  thread: any;
  userName: any;
  user: User;
  allUserNames: User[];
  allUserNamesLoaded: boolean = false;


  async ngOnInit() {
    let data: any = this.location.getState();
    await this.checkCurrentUser();
    await this.loadAllUsers();
    if(data.thread != undefined){
      this.thread = data.thread;
    } else if(data.userThread != undefined){
      this.thread = data.userThread;
    }
    if (this.thread !== null && this.thread !== undefined && this.thread.threadID !== undefined && this.thread.threadID !== null) {
      this.threadItemSearchCriteria.controls.threadID.patchValue(this.thread.threadID);
      this.threadItemService.getAll(this.threadItemSearchCriteria.value).subscribe({
        next: this.handleSearchResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    } else {
      this.snackBar.open(`Error loading thread.`, 'dismiss', {
        duration: 3000
      });
    }
  }

  handleSearchResponse(result: any) {
    if (result !== null && result.message == undefined) {
      this.allThreadItems = result.data;
      this.checkReplyDepth();
      this.finishedLoadingData = true;
    } else {
      this.allThreadItems = [];
      this.finishedLoadingData = true;
    }
  }

  checkReplyDepth(){
    ///go through each post in thread
    for(let item of this.allThreadItems){
      let currentItem: any = item;
      ///if no replyID depth is 0
      if(item.replyID == null){
        currentItem.depth = 0;
      } else {
        ///if replyID, increment depth
        ///and go through the list until there are no more replies
        ///while incrementing the depth along the way 
        currentItem.depth = 0;
        let check: any = item;
        while(check != undefined && check.replyID !== null){
          let replyID = check.replyID;
          currentItem.depth += 1;
          check = this.allThreadItems.find(obj => obj.threadItemID == replyID);
        }
        currentItem.depthStyle = `${currentItem.depth}rem`;
      }
    }
  }

  handleErrorResponse(error: any) {
    this.snackBar.open(`Error ${error} loading threads.`, 'dismiss', {
      duration: 3000
    });
    this.allThreadItems = [];
  }

  public handleDeleteResponse(data:any){
    if(data == null){
      this.clearThreadSearch();
    } else {
      this.clearThreadSearch();
    }
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
      this.threadItemSearchCriteria.controls.pagination.patchValue('false');
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

  editThreadItem(threadItem: ThreadItem) {
    let data;
    if(threadItem.replyID !== undefined && threadItem.replyID !== null){
      data = {
        thread: this.thread,
        isEdit: true,
        threadItem: threadItem,
        replyID: threadItem.replyID
      }
    } else {
      data = {
        thread: this.thread,
        isEdit: true,
        threadItem: threadItem
      }
    }
    
    const dialogRefAdd = this.matDialog.open(AddThreadItemComponent, {
      width: '100%',
      disableClose: true,
      data: data
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
    let post = threadItem;
    const dialogRefAdd = this.matDialog.open(AddThreadItemComponent, {
      width: '100%',
      disableClose: true,
      data: {
        thread: this.thread,
        isEdit: false,
        isReply: true,
        replyID: post.threadItemID
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

  async checkCurrentUser(){
    this.userName = localStorage.getItem('userName') ? localStorage.getItem('userName'): '';
    this.user = await lastValueFrom(this.userService.getUserByName(this.userName).pipe());
  }

  public deleteThreadItem(element: any){
    const dialogRefDelete = this.matDialog.open(PopUpComponent, {
      width: '100%',
      disableClose: true,
      data: {
        element,
        model: 'threadItem'
      }
    });

    dialogRefDelete.afterClosed().subscribe(result => {
      if(result.event === 'delete'){
        this.threadItemService.delete(element.threadItemID).subscribe({
          next: this.handleDeleteResponse.bind(this),
          error: this.handleErrorResponse.bind(this)
        });
        this.snackBar.open(`Post has been deleted.`, 'dismiss',{
          duration: 3000
        });
      } else {
        this.snackBar.open(`Post has not been deleted.`, 'dismiss',{
          duration: 3000
        });
      }
    });
  }

  async loadAllUsers(){
    if(!this.allUserNamesLoaded){
      try{
        let result = await lastValueFrom(this.userService.getAllUserNames().pipe());
        if(result != null && result != undefined){
          this.allUserNames = result;
        }
        this.allUserNamesLoaded = true;
      }catch(err){
        console.error(err);
        this.snackBar.open(`Error loading all users.`, 'dismiss',{
          duration: 3000
        });
        throw err;
      }
    }
  }

  getUserNameByUserID(userID: any){
    if(userID != undefined){
      let userName = this.allUserNames.find(obj => obj.userID == userID);
      if(userName != undefined){
        return userName.userName;
      } else {
        return 'userName not found';
      }
    } else {
      return 'userName not found';
    }
  }

  viewUserProfile(element: any){
    if(element.userID != this.user.userID){
      this.router.navigate([`/view-user-profile/${element.userID}`], 
      { state: {
          userID: element.userID
        }
      });
    }
  }
}
