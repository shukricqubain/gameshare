import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Board } from 'src/app/models/board.model';
import { BoardService } from 'src/app/services/board.service';
import { DateFunctionsService } from 'src/app/services/dateFunctions.service';
import { MatCard } from '@angular/material/card';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BoardComponent } from './board/board.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddBoardComponent } from './add-board/add-board.component';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { PopUpComponent } from 'src/app/components/pop-up/pop-up.component';
import { UserBoardService } from 'src/app/services/userBoard.service';
import { UserBoard } from 'src/app/models/userBoard.model';


@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css']
})
export class BoardsComponent {


  constructor(
    private boardService: BoardService,
    private userBoardService: UserBoardService,
    private changeDetectorRef: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private matDialog: MatDialog,
    private router: Router,
    private dateFunction: DateFunctionsService,
    private userService: UserService
  ) { }

  search: any;
  pageSize = 100;
  currentPage = 0;
  resultsLength = 0;
  isLoadingResults: boolean = false;

  boardSearchCriteria = new FormGroup({
    searchTerm: new FormControl(''),
    sort: new FormControl('boardID', [Validators.required]),
    pagination: new FormControl('false', [Validators.required]),
    direction: new FormControl('asc', [Validators.required]),
    limit: new FormControl(5, [Validators.required]),
    page: new FormControl(0, [Validators.required])
  });

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<Board>();

  userName: any;
  user: User;
  userBoards: UserBoard[];
  userBoardsLoaded: boolean = false;

  async ngOnInit() {
    await this.checkCurrentUser();
    await this.loadAllBoards();
    await this.loadAllUserBoards();
  }

  async loadAllBoards() {
    this.isLoadingResults = true;
    this.boardService.getAll(this.boardSearchCriteria.value).subscribe({
      next: this.handleSearchResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

  async handleSearchResponse(data: any) {
    this.dataSource.data = data.data;
    this.resultsLength = data.boardCount;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if(!this.userBoardsLoaded){
      await this.loadAllUserBoards();
    } else {
      this.checkBoards();
    }
    this.isLoadingResults = false;
  }

  handleErrorResponse(error: any) {
    this.snackBar.open(`Error ${error} loading Boards.`, 'dismiss', {
      duration: 3000
    });
    this.isLoadingResults = false;
  }

  public handleDeleteResponse(data: any) {
    if (data == null) {
      this.clearBoardSearch();
    } else {
      this.clearBoardSearch();
    }
  }

  openBoard(board: Board) {
    this.router.navigate([`/board/${board.boardID}`], { state: { board: board, user: this.user } });
  }

  applyBoardSearch() {
    this.isLoadingResults = true;
    this.boardService.getAll(this.boardSearchCriteria.value).subscribe({
      next: this.handleSearchResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

  clearBoardSearch() {
    this.boardSearchCriteria.controls.searchTerm.patchValue('');
    this.boardSearchCriteria.controls.sort.patchValue('boardID');
    this.boardSearchCriteria.controls.pagination.patchValue('false');
    this.boardSearchCriteria.controls.direction.patchValue('asc');
    this.boardSearchCriteria.controls.limit.patchValue(5);
    this.boardSearchCriteria.controls.page.patchValue(0);
    this.boardService.getAll(this.boardSearchCriteria.value).subscribe({
      next: this.handleSearchResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });

  }

  addBoard() {
    const dialogRefAdd = this.matDialog.open(AddBoardComponent, {
      width: '100%',
      disableClose: true,
      data: {
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

  async checkCurrentUser() {
    this.userName = localStorage.getItem('userName') ? localStorage.getItem('userName') : '';
    this.user = await lastValueFrom(this.userService.getUserByName(this.userName).pipe());
  }

  async editBoard(board: Board) {
    const dialogRefEdit = this.matDialog.open(AddBoardComponent, {
      width: '100%',
      disableClose: true,
      data: {
        isEdit: true,
        element: board
      }
    });

    dialogRefEdit.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.clearBoardSearch();
      } else {
        this.clearBoardSearch();
      }
    });
  }

  async deleteBoard(board: Board) {
    const dialogRefDelete = this.matDialog.open(PopUpComponent, {
      width: '100%',
      disableClose: true,
      data: {
        element: board,
        model: 'board'
      }
    });

    dialogRefDelete.afterClosed().subscribe(result => {
      if (result.event === 'delete') {
        this.boardService.delete(board.boardID).subscribe({
          next: this.handleDeleteResponse.bind(this),
          error: this.handleErrorResponse.bind(this)
        });
        this.snackBar.open(`${board.boardName} has been deleted.`, 'dismiss', {
          duration: 3000
        });
      } else {
        this.snackBar.open(`${board.boardName} has not been deleted.`, 'dismiss', {
          duration: 3000
        });
      }
    });
  }

  followBoard(board: Board) {
    let newUserBoard: UserBoard = {
      userBoardID: 0,
      boardName: board.boardName,
      boardID: board.boardID,
      userID: this.user.userID,
      gameID: board.gameID,
      gameName: board.gameName,
      createdAt: '',
      updatedAt: ''
    };
    this.userBoardService.create(newUserBoard).subscribe({
      next: this.handleFollowResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }
  
  async unfollowBoard(board: Board){
    if(!this.userBoardsLoaded){
      await this.loadAllUserBoards();
    }
    let userBoard = this.userBoards.find(obj => obj.boardID == board.boardID);
    if(userBoard !== undefined){
      this.userBoardService.delete(userBoard?.userBoardID).subscribe({
        next: this.handleUnfollowResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    } else {
      this.snackBar.open('Unfollow was not successful: User Board was undefined.', 'dismiss',{
        duration: 3000
      });
    }
  }

  handleFollowResponse(data: any){
    if(data !== null){
      this.snackBar.open('Successfully followed a board!', 'dismiss',{
        duration: 3000
      });
      this.ngOnInit();
    }
  }

  handleUnfollowResponse(data: any){
    if(data == null){
      this.snackBar.open('Successfully unfollowed a board!', 'dismiss',{
        duration: 3000
      });
      this.ngOnInit();
    } else {
      this.ngOnInit();
    }
  }

  async loadAllUserBoards() {
    try {
      let userBoardSearchCriteria = {
        boardSearchTerm: '',
        sort: 'userBoardID',
        pagination: 'false',
        direction: 'asc',
        limit: 5,
        page: 0,
        userID: this.user.userID
      }
      let result = await lastValueFrom(this.userBoardService.getAll(userBoardSearchCriteria).pipe());
      if(result !== null && result !== undefined && result.message == undefined){
        this.userBoards = result.data;
        this.checkBoards();
        this.userBoardsLoaded = true;
      } else {
        this.userBoards = [];
        this.userBoardsLoaded = true;
      }
    } catch (err) {
      this.snackBar.open('Error loading user boards!', 'dismiss', {
        duration: 3000
      });
      console.log(err)
    }
  }

  checkBoards(){
    for(let board of this.dataSource.data){
      let match = this.userBoards.find(obj => obj.boardID == board.boardID);
      if(match !== undefined && match !== null){
        board.isFollowing = true;
      } else {
        board.isFollowing = false;
      }
    }
  }
}
