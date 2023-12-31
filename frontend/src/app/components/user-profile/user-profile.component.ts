import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { MatSnackBar } from "@angular/material/snack-bar";
import { UserService } from 'src/app/services/user.service';
import { UsernameService } from 'src/app/services/username.service';
import { RoleService } from 'src/app/services/roleID.service';
import { UserGameService } from 'src/app/services/userGame.service';
import { MatTableDataSource } from '@angular/material/table';
import { UserGame } from 'src/app/models/userGame.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DateFunctionsService } from 'src/app/services/dateFunctions.service';
import { AddUserGameComponent } from './add-user-game/add-user-game.component';
import { MatDialog } from '@angular/material/dialog';
import { GameName } from 'src/app/models/gameName.model';
import { GameService } from 'src/app/services/game.service';
import { PopUpComponent } from 'src/app/components/pop-up/pop-up.component';
import { catchError, map, merge, startWith, switchMap, of as observableOf, lastValueFrom } from 'rxjs';
import { UserAchievement } from 'src/app/models/userAchievement.model';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AddUserAchievementComponent } from './add-user-achievement/add-user-achievement.component';
import { UserAchievementService } from 'src/app/services/userAchievement.service';
import { AchievementName } from 'src/app/models/achievementName.model';
import { AchievementService } from 'src/app/services/achievement.service';
import { Board } from 'src/app/models/board.model';
import { UserBoardService } from 'src/app/services/userBoard.service';
import { AddUserBoardComponent } from './add-user-board/add-user-board.component';
import { BoardService } from 'src/app/services/board.service';
import { Thread } from 'src/app/models/thread.model';
import { ThreadService } from 'src/app/services/thread.service';
import { UserThreadService } from 'src/app/services/userThread.service';
import { AddUserThreadComponent } from './add-user-thread/add-user-thread.component';
import { Game } from 'src/app/models/game.model';
import { GameInfoComponent } from '../games/game-info/game-info.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {

  constructor(
    private location: Location,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private usernameService: UsernameService,
    private roleService: RoleService,
    private gameService: GameService,
    private achievementService: AchievementService,
    private userGameService: UserGameService,
    private dateFunction: DateFunctionsService,
    private userAchievementService: UserAchievementService,
    private userBoardService: UserBoardService,
    private boardService: BoardService,
    private threadService: ThreadService,
    private userThreadService: UserThreadService,
    private matDialog: MatDialog
  ) {
  }

  user: User;
  userProfileForm = new FormGroup({
    userID: new FormControl('', [Validators.required]),
    userName: new FormControl('', [Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    dateOfBirth: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
    userRole: new FormControl(''),
    userPassword: new FormControl('', [Validators.required]),
    createdAt: new FormControl(''),
    updatedAt: new FormControl('')
  });
  showPassword: boolean = false;
  editEnabled: boolean = false;
  enableMessage: string = `Enable the form for updation.`;
  userLoaded: boolean = false;

  userGameSearchCriteria = new FormGroup({
    searchTerm: new FormControl(''),
    sort: new FormControl('userGameID', [Validators.required]),
    pagination: new FormControl('false', [Validators.required]),
    direction: new FormControl('asc', [Validators.required]),
    limit: new FormControl(5, [Validators.required]),
    page: new FormControl(0, [Validators.required]),
    userID: new FormControl('')
  });
  allGameNames: GameName[] = [];
  userGames: any[] = [];
  allGames: any[] = [];
  gamesLoaded: boolean = false;
  userGamesLoaded: boolean = false;

  achievementSearchCriteria = new FormGroup({
    achievementSearchTerm: new FormControl(''),
    sort: new FormControl('userAchievementID', [Validators.required]),
    pagination: new FormControl('true', [Validators.required]),
    direction: new FormControl('asc', [Validators.required]),
    limit: new FormControl(5, [Validators.required]),
    page: new FormControl(0, [Validators.required]),
    userID: new FormControl('')
  });

  displayedUserAchievementColumns: string[] = ['userAchievementID', 'achievementName', 'gameID', 'gameName', 'userID', 'achievementStatus', 'createdAt', 'updatedAt', 'actions'];
  userAchievementDataSource = new MatTableDataSource<any>;
  userAchievementData: UserAchievement[];
  achievementPageSize = 5;
  currentAchievementPage = 0;
  achievementResultsLength = 0;
  achievementsLoaded: boolean = false;

  @ViewChild('achievementPaginator') achievementPaginator: MatPaginator;
  @ViewChild('achievementSort') achievementSort: MatSort;

  displayedUserBoardColumns: string[] = ['userBoardID', 'boardName', 'userID', 'gameID', 'gameName', 'createdAt', 'updatedAt', 'actions'];
  userBoardsDataSource = new MatTableDataSource<any>;
  boardData: Board[];
  boardPageSize = 5;
  currentBoardPage = 0;
  boardResultsLength = 0;

  @ViewChild('boardPaginator') boardPaginator: MatPaginator;
  @ViewChild('boardSort') boardSort: MatSort;

  boardSearchCriteria = new FormGroup({
    boardSearchTerm: new FormControl(''),
    sort: new FormControl('userBoardID', [Validators.required]),
    pagination: new FormControl('true', [Validators.required]),
    direction: new FormControl('asc', [Validators.required]),
    limit: new FormControl(5, [Validators.required]),
    page: new FormControl(0, [Validators.required]),
    userID: new FormControl('')
  });
  allBoardNames: Board[] = [];

  private currentTabIndex = 0;
  allAchievementNames: AchievementName[] = [];
  gameNamesLoaded: boolean = false;
  achievementNamesLoaded: boolean = false;
  boardsLoaded: boolean = false;

  displayedUserThreadColumns: string[] = ['userThreadID', 'threadID', 'threadName', 'boardName', 'userID', 'createdAt', 'updatedAt', 'actions'];
  userThreadsDataSource = new MatTableDataSource<any>;
  threadData: Board[];
  threadPageSize = 5;
  currentThreadPage = 0;
  threadResultsLength = 0;

  @ViewChild('threadPaginator') threadPaginator: MatPaginator;
  @ViewChild('threadSort') threadSort: MatSort;

  threadSearchCriteria = new FormGroup({
    threadSearchTerm: new FormControl(''),
    sort: new FormControl('userThreadID', [Validators.required]),
    pagination: new FormControl('true', [Validators.required]),
    direction: new FormControl('asc', [Validators.required]),
    limit: new FormControl(5, [Validators.required]),
    page: new FormControl(0, [Validators.required]),
    userID: new FormControl('')
  });

  allThreadNames: Thread[] = [];
  threadsLoaded: boolean = false;
  minDate: Date;
  emailValidation = '^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$';

  async ngAfterViewInit() {

    let data: any = this.location.getState();
    if (this.userLoaded == false && data !== null) {
      await this.loadUserDetails(data);
    } else if (data == null) {
      this.snackBar.open('An error occured while trying to load user profile with id of ``', 'dismiss', {
        duration: 3000
      });
    }

    ///setup minimum date of birth for user to be 13
    let currentDate = new Date();
    let year = currentDate.getFullYear() - 13;
    let month = currentDate.getMonth() + 1;
    let day = currentDate.getDate();
    this.minDate = new Date(`${year}-${month}-${day}`);

    if (this.currentTabIndex == 0 && this.threadsLoaded == false) {

      await this.loadAllThreadNames();
      this.userThreadsDataSource.sort = this.threadSort;
      ///if user changes the sort order reset the page back to the first page
      this.threadSort.sortChange.subscribe(() => (this.threadPaginator.pageIndex = 0));
      merge(this.threadSort.sortChange, this.threadPaginator.page, this.threadPaginator.pageSize)
        .pipe(
          startWith({}),
          switchMap(() => {
            this.threadSearchCriteria.controls.sort.patchValue(this.threadSort.active);
            this.threadSearchCriteria.controls.direction.patchValue(this.threadSort.direction);
            this.threadSearchCriteria.controls.page.patchValue(this.threadPaginator.pageIndex);
            this.threadSearchCriteria.controls.limit.patchValue(this.threadPaginator.pageSize);
            return this.userThreadService!.getAll(this.threadSearchCriteria.value).pipe(catchError(() => observableOf(null)));
          }),
          map(data => {
            if (data === null) {
              return [];
            }
            this.threadResultsLength = data.userThreadCount;
            this.threadsLoaded = true;
            return data.data;
          }),
        )
        .subscribe(data => (this.userThreadsDataSource = data));

    } else if (this.currentTabIndex == 1 && this.boardsLoaded == false) {

      await this.loadAllBoardNames();
      this.userBoardsDataSource.sort = this.boardSort;
      ///if user changes the sort order reset the page back to the first page
      this.boardSort.sortChange.subscribe(() => (this.boardPaginator.pageIndex = 0));
      merge(this.boardSort.sortChange, this.boardPaginator.page, this.boardPaginator.pageSize)
        .pipe(
          startWith({}),
          switchMap(() => {
            this.boardSearchCriteria.controls.sort.patchValue(this.boardSort.active);
            this.boardSearchCriteria.controls.direction.patchValue(this.boardSort.direction);
            this.boardSearchCriteria.controls.page.patchValue(this.boardPaginator.pageIndex);
            this.boardSearchCriteria.controls.limit.patchValue(this.boardPaginator.pageSize);
            return this.userBoardService!.getAll(this.boardSearchCriteria.value).pipe(catchError(() => observableOf(null)));
          }),
          map(data => {
            if (data === null) {
              return [];
            }
            this.boardResultsLength = data.userBoardCount;
            this.boardsLoaded = true;
            return data.data;
          }),
        )
        .subscribe(data => (this.userBoardsDataSource = data));

    } else if (this.currentTabIndex == 2) {
      await this.loadAllGames();
      await this.loadAllGameNames();
      await this.loadAllUserGames();
    } else if (this.currentTabIndex == 3 && this.achievementsLoaded == false) {
      await this.loadAllGameNames();
      await this.loadAchievementNames();
      this.userAchievementDataSource.sort = this.achievementSort;
      ///if user changes the sort order reset the page back to the first page
      this.achievementSort.sortChange.subscribe(() => (this.achievementPaginator.pageIndex = 0));
      merge(this.achievementSort.sortChange, this.achievementPaginator.page, this.achievementPaginator.pageSize)
        .pipe(
          startWith({}),
          switchMap(() => {
            this.achievementSearchCriteria.controls.sort.patchValue(this.achievementSort.active);
            this.achievementSearchCriteria.controls.direction.patchValue(this.achievementSort.direction);
            this.achievementSearchCriteria.controls.page.patchValue(this.achievementPaginator.pageIndex);
            this.achievementSearchCriteria.controls.limit.patchValue(this.achievementPaginator.pageSize);
            return this.userAchievementService!.getAll(this.achievementSearchCriteria.value).pipe(catchError(() => observableOf(null)));
          }),
          map(data => {
            if (data === null) {
              return [];
            }
            this.achievementResultsLength = data.achievementCount;
            this.achievementsLoaded = true;
            return data.data;
          }),
        )
        .subscribe(data => (this.userAchievementDataSource = data));
      this.changeForm();
    } else if (this.currentTabIndex == 4) {
      this.changeForm();
    }

  }

  public onSelectedIndexChange(tabIndex: number) {
    this.currentTabIndex = tabIndex;
  }

  public onSelectedTabChange(matTabChangeEvent: MatTabChangeEvent) {
    this.ngAfterViewInit();
  }

  async onSubmit() {
    let initial_username = this.user.userName;
    let updated_username = this.userProfileForm.controls.userName.value;
    let initial_role = localStorage.getItem('roleID');
    let updated_role = this.userProfileForm.controls.userRole.value;
    if (initial_username !== null && updated_username !== null && initial_username !== updated_username) {
      this.usernameService.setUsernameObs(updated_username);
    }
    if (initial_role !== null && updated_role !== null && initial_role !== updated_role) {
      this.roleService.setRoleObs(updated_role);
      localStorage.setItem('roleID', updated_role);
    }
    await this.userService.update(this.userProfileForm.value).subscribe({
      next: this.handleUpdateResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

  handleUpdateResponse(data: any) {
    this.snackBar.open(data.message, 'dismiss', {
      duration: 2000
    });
    this.editEnabled = false;
    this.changeForm();
  }

  handleErrorResponse(data: any) {
    this.snackBar.open(data.message, 'dismiss', {
      duration: 2000
    });
  }

  changeForm() {
    if (this.editEnabled) {
      this.enableMessage = `Disable the form for updation.`;
      this.userProfileForm.controls.userID.enable();
      this.userProfileForm.controls.userName.enable();
      this.userProfileForm.controls.firstName.enable();
      this.userProfileForm.controls.lastName.enable();
      this.userProfileForm.controls.dateOfBirth.enable();
      this.userProfileForm.controls.email.enable();
      this.userProfileForm.controls.phoneNumber.enable();
      this.userProfileForm.controls.userRole.enable();
      this.userProfileForm.controls.userPassword.enable();
    } else {
      this.enableMessage = `Enable the form for updation.`;
      this.userProfileForm.controls.userID.disable();
      this.userProfileForm.controls.userName.disable();
      this.userProfileForm.controls.firstName.disable();
      this.userProfileForm.controls.lastName.disable();
      this.userProfileForm.controls.dateOfBirth.disable();
      this.userProfileForm.controls.email.disable();
      this.userProfileForm.controls.phoneNumber.disable();
      this.userProfileForm.controls.userRole.disable();
      this.userProfileForm.controls.userPassword.disable();
    }
  }

  async loadUserDetails(data: any) {
    if (data.userID == undefined) {
      let userName = localStorage.getItem('userName');
      if (userName !== null) {
        await this.userService.getUserByName(userName).subscribe({
          next: this.handleGetResponse.bind(this),
          error: this.handleErrorResponse.bind(this)
        });
      }
    } else {
      await this.userService.get(data.userID).subscribe({
        next: this.handleGetResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    }
  }

  handleGetResponse(data: any) {
    this.user = data;
    this.userProfileForm.controls.userID.setValue(data.userID ? `${data.userID}` : '');
    this.userProfileForm.controls.userName.setValue(data.userName ? data.userName : '');
    this.userProfileForm.controls.firstName.setValue(data.firstName ? data.firstName : '');
    this.userProfileForm.controls.lastName.setValue(data.lastName ? data.lastName : '');
    this.userProfileForm.controls.dateOfBirth.setValue(data.dateOfBirth ? data.dateOfBirth : '');
    this.userProfileForm.controls.email.setValue(data.email ? data.email : '');
    this.userProfileForm.controls.phoneNumber.setValue(data.phoneNumber ? data.phoneNumber : '');
    this.userProfileForm.controls.userRole.setValue(data.userRole ? `${data.userRole}` : '');
    this.userProfileForm.controls.userPassword.setValue(data.userPassword ? data.userPassword : '');
    this.userProfileForm.controls.createdAt.setValue(data.createdAt ? data.createdAt : '');
    this.userProfileForm.controls.updatedAt.setValue(data.updatedAt ? data.updatedAt : '');
    //patch search forms with userID for games and achievement collections
    this.achievementSearchCriteria.controls.userID.setValue(data.userID);
    this.userGameSearchCriteria.controls.userID.setValue(data.userID);
    this.boardSearchCriteria.controls.userID.patchValue(data.userID);
    this.threadSearchCriteria.controls.userID.patchValue(data.userID);
    this.userLoaded = true;
  }

  public handleAchievementSearchResponse(data: any) {
    if (data == null || data.message === 'No data in user achievement table to fetch.') {
      this.userAchievementDataSource.data = [];
      this.achievementResultsLength = 0;
      this.ngAfterViewInit();
    } else {
      this.userAchievementDataSource.data = data.data;
      this.achievementResultsLength = data.achievementCount;
      this.ngAfterViewInit();
    }
  }

  editUserGame(element: any) {
    const dialogRef = this.matDialog.open(AddUserGameComponent, {
      width: '100%',
      disableClose: true,
      data: {
        isEdit: true,
        userID: this.user.userID,
        allGameNames: this.allGameNames,
        element: element
      }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result !== undefined) {
        this.userGamesLoaded = false;
        await this.loadAllUserGames();
      }
    });
  }

  deleteUserGame(element: any) {
    const dialogRefDelete = this.matDialog.open(PopUpComponent, {
      width: '100%',
      disableClose: true,
      data: {
        element,
        model: 'userGame',
        allGameNames: this.allGameNames
      }
    });
    let game = this.allGameNames.find(obj => obj.gameID == element.gameID);
    let gameName = '';
    if (game !== undefined) {
      gameName = game.gameName ? game.gameName : '';
    } else {
      ///throw error
      this.snackBar.open(`No game with this ID found in the system.`, 'dismiss', {
        duration: 3000
      });
      return;
    }

    dialogRefDelete.afterClosed().subscribe(result => {
      if (result.event === 'delete') {
        this.userGameService.delete(element.userGameID).subscribe({
          next: this.handleGameDeleteResponse.bind(this),
          error: this.handleErrorResponse.bind(this)
        });
        this.snackBar.open(`${gameName} has been deleted.`, 'dismiss', {
          duration: 3000
        });
      } else {
        this.snackBar.open(`${gameName} has not been deleted.`, 'dismiss', {
          duration: 3000
        });
      }
    });
  }

  public async handleGameDeleteResponse(data: any) {
    if (data !== null) {
      this.userGamesLoaded = false;
      await this.loadAllUserGames();
    }
  }

  public formatDate(date: any) {
    let formattedDate = this.dateFunction.formatDateMMDDYYYY(date);
    return formattedDate;
  }

  addUserGame() {
    const dialogRef = this.matDialog.open(AddUserGameComponent, {
      width: '100%',
      data: {
        isEdit: false,
        userID: this.user.userID,
        allGameNames: this.allGameNames
      }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result !== undefined) {
        this.userGamesLoaded = false;
        await this.loadAllUserGames();
      }
    });
  }

  async applyUserGameSearch() {
    this.userGamesLoaded = false;
    await this.loadAllUserGames();
  }

  addUserAchievement() {
    const dialogRef = this.matDialog.open(AddUserAchievementComponent, {
      width: '100%',
      data: {
        isEdit: false,
        userID: this.user.userID,
        allGameNames: this.allGameNames
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.ngAfterViewInit();
      } else {
        this.ngAfterViewInit();
      }
    });
  }

  applyAchievementSearch = async () => {
    this.achievementsLoaded = false;
    this.userAchievementService.getAll(this.achievementSearchCriteria.value).subscribe({
      next: this.handleAchievementSearchResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

  async clearGameSearch() {
    this.userGameSearchCriteria.controls.searchTerm.patchValue('');
    this.userGameSearchCriteria.controls.sort.patchValue('gameID');
    this.userGameSearchCriteria.controls.pagination.patchValue('false');
    this.userGameSearchCriteria.controls.direction.patchValue('asc');
    this.userGameSearchCriteria.controls.limit.patchValue(5);
    this.userGameSearchCriteria.controls.page.patchValue(0);
    this.userGamesLoaded = false;
    await this.loadAllUserGames();
  }

  public clearAchievementSearch() {
    this.achievementSearchCriteria.controls.achievementSearchTerm.patchValue('');
    this.achievementSearchCriteria.controls.sort.patchValue('userAchievementID');
    this.achievementSearchCriteria.controls.pagination.patchValue('true');
    this.achievementSearchCriteria.controls.direction.patchValue('asc');
    this.achievementSearchCriteria.controls.limit.patchValue(5);
    this.achievementSearchCriteria.controls.page.patchValue(0);
    this.achievementsLoaded = false;
    this.userAchievementService.getAll(this.achievementSearchCriteria.value).subscribe({
      next: this.handleAchievementSearchResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

  async loadAllGameNames() {
    if (!this.gameNamesLoaded) {
      this.gameService.getAllGameNames().subscribe({
        next: this.handleGetAllNamesResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    }
  }

  async loadAllGames() {
    try {
      if (!this.gamesLoaded) {
        let result = await lastValueFrom(this.gameService.getAll({
          searchTerm: '',
          sort: 'gameID',
          pagination: 'false',
          direction: 'asc'
        }).pipe());
        if(result != undefined){
          this.allGames = result.data;
          this.gamesLoaded = true;
        }
      }
    } catch (err) {
      console.error(err);
      this.allGames = [];
      this.snackBar.open('Error loading all games.', 'dismiss', {
        duration: 2000
      });
    }
  }

  async loadAllUserGames() {
    try {
      if (!this.userGamesLoaded) {
        let result = await lastValueFrom(this.userGameService.getAll(this.userGameSearchCriteria.value).pipe());
        if(result != null && result != undefined){
          if(result != undefined && result === 'No data in userGame table to fetch.'){
            this.userGames = [];
          } else {
            this.userGames = result.data;
            for (let userGame of this.userGames) {
              let game = this.allGames.find(obj => obj.gameID == userGame.gameID);
              if (game != null && game != undefined) {
                userGame.game = game;
              }
            }
          }
          this.userGamesLoaded = true;
        }
      }
    } catch(err){
      console.error(err);
      this.userGames = [];
      this.snackBar.open('Error loading user games.', 'dismiss', {
        duration: 2000
      });
    }
  }

  async loadAllBoardNames() {
    try {
      if (!this.boardsLoaded) {
        this.allBoardNames = await lastValueFrom(this.boardService.getAllBoardNames().pipe());
      }
    } catch (err) {
      this.snackBar.open('Error loading board names!', 'dismiss', {
        duration: 3000
      });
      console.log(err);
    }
  }

  async loadAllThreadNames() {
    try {
      this.allThreadNames = await lastValueFrom(this.threadService.getAllThreadNames().pipe());
    } catch (err) {
      this.snackBar.open('Error loading board names!', 'dismiss', {
        duration: 3000
      });
      console.log(err);
    }
  }

  handleGetAllBoardNamesResponse(data: any) {
    if (data !== null && data !== undefined) {
      this.allBoardNames = data;
    }
  }

  handleGetAllNamesResponse(data: any) {
    if (data !== null && data !== undefined) {
      this.allGameNames = data;
      this.gameNamesLoaded = false;
    }
  }

  handleGetAllGamesResponse(data: any) {
    if (data !== null && data !== undefined) {
      this.allGames = data.data;
    } else {
      this.allGames = [];
    }
    this.gamesLoaded = true;
  }

  getGameName(element: any) {
    let gameName = this.allGameNames.find(obj => obj.gameID == element);
    if (gameName !== undefined) {
      return gameName.gameName;
    } else {
      return 'No Game with this ID'
    }
  }

  editUserAchievement(element: any) {
    const dialogRef = this.matDialog.open(AddUserAchievementComponent, {
      width: '100%',
      disableClose: true,
      data: {
        isEdit: true,
        userID: this.user.userID,
        allAchievementNames: this.allAchievementNames,
        allGameNames: this.allGameNames,
        element: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.ngAfterViewInit();
      } else {
        this.ngAfterViewInit();
      }
    });
  }

  deleteUserAchievement(element: any) {
    const dialogRefDelete = this.matDialog.open(PopUpComponent, {
      width: '100%',
      disableClose: true,
      data: {
        element,
        model: 'userAchievement',
        allAchievementNames: this.allAchievementNames
      }
    });
    let achievement = this.allAchievementNames.find(obj => obj.achievementID == element.achievementID);
    let achievementName = '';
    if (achievement !== undefined) {
      achievementName = achievement.achievementName ? achievement.achievementName : '';
    } else {
      ///throw error
      this.snackBar.open(`No achievement with this ID found in the system.`, 'dismiss', {
        duration: 3000
      });
      return;
    }

    dialogRefDelete.afterClosed().subscribe(result => {
      if (result.event === 'delete') {
        this.userAchievementService.delete(element.userAchievementID).subscribe({
          next: this.handleAchievementDeleteResponse.bind(this),
          error: this.handleErrorResponse.bind(this)
        });
        this.snackBar.open(`${achievementName} has been deleted.`, 'dismiss', {
          duration: 3000
        });
      } else {
        this.snackBar.open(`${achievementName} has not been deleted.`, 'dismiss', {
          duration: 3000
        });
      }
    });
  }

  async loadAchievementNames() {
    try {
      if (!this.achievementNamesLoaded) {
        this.allAchievementNames = await lastValueFrom(this.achievementService.getAllAchievementsNames().pipe());
      }
    } catch (err) {
      this.snackBar.open('Error loading achievement names!', 'dismiss', {
        duration: 3000
      });
      console.log(err);
    }
  }

  public handleAchievementDeleteResponse(data: any) {
    if (data !== null) {
      this.ngAfterViewInit();
    } else {
      this.ngAfterViewInit();
    }
  }

  applyBoardSearch() {
    this.boardsLoaded = false;
    let trimmedSearch = this.boardSearchCriteria.controls.boardSearchTerm.value?.trim();
    if (trimmedSearch !== undefined && trimmedSearch !== null) {
      this.boardSearchCriteria.controls.boardSearchTerm.patchValue(trimmedSearch);
      this.userBoardService.getAll(this.boardSearchCriteria.value).subscribe({
        next: this.handleBoardSearchResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    }
  }

  clearBoardSearch() {
    this.boardSearchCriteria.controls.boardSearchTerm.patchValue('');
    this.boardSearchCriteria.controls.sort.patchValue('userBoardID');
    this.boardSearchCriteria.controls.pagination.patchValue('true');
    this.boardSearchCriteria.controls.direction.patchValue('asc');
    this.boardSearchCriteria.controls.limit.patchValue(5);
    this.boardSearchCriteria.controls.page.patchValue(0);
    this.boardsLoaded = false;
    this.userBoardService.getAll(this.boardSearchCriteria.value).subscribe({
      next: this.handleBoardSearchResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

  handleBoardSearchResponse(data: any) {
    if (data == null || data.message === 'No data in userBoard table to fetch.') {
      this.boardResultsLength = 0;
      this.ngAfterViewInit();
    } else {
      this.userBoardsDataSource.data = data.data;
      this.boardResultsLength = data.userBoardCount;
      this.ngAfterViewInit();
    }
  }

  addUserBoard() {
    const dialogRef = this.matDialog.open(AddUserBoardComponent, {
      width: '100%',
      data: {
        isEdit: false,
        userID: this.user.userID,
        allBoardNames: this.allBoardNames
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.ngAfterViewInit();
      } else {
        this.ngAfterViewInit();
      }
    });
  }

  addUserThread() {
    const dialogRef = this.matDialog.open(AddUserThreadComponent, {
      width: '100%',
      data: {
        isEdit: false,
        userID: this.user.userID,
        allThreadNames: this.allThreadNames
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.ngAfterViewInit();
      } else {
        this.ngAfterViewInit();
      }
    });
  }

  applyThreadSearch() {
    this.threadsLoaded = false;
    let trimmedSearch = this.threadSearchCriteria.controls.threadSearchTerm.value?.trim();
    if (trimmedSearch !== undefined && trimmedSearch !== null) {
      this.threadSearchCriteria.controls.threadSearchTerm.patchValue(trimmedSearch);
      this.userThreadService.getAll(this.threadSearchCriteria.value).subscribe({
        next: this.handleThreadSearchResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    }
  }

  clearThreadSearch() {
    this.threadSearchCriteria.controls.threadSearchTerm.patchValue('');
    this.threadSearchCriteria.controls.sort.patchValue('userThreadID');
    this.threadSearchCriteria.controls.pagination.patchValue('true');
    this.threadSearchCriteria.controls.direction.patchValue('asc');
    this.threadSearchCriteria.controls.limit.patchValue(5);
    this.threadSearchCriteria.controls.page.patchValue(0);
    this.threadsLoaded = false;
    this.userThreadService.getAll(this.threadSearchCriteria.value).subscribe({
      next: this.handleThreadSearchResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

  handleThreadSearchResponse(data: any) {
    console.log(data)
    if (data == null || data.message === 'No data in userThread table to fetch.') {
      this.userThreadsDataSource.data = [];
      this.threadResultsLength = 0;
      this.ngAfterViewInit();
    } else {
      this.userThreadsDataSource.data = data.data;
      this.threadResultsLength = data.userThreadCount;
      this.ngAfterViewInit();
    }
  }

  gameInfoPopup(game: Game) {
    const dialogRefAdd = this.matDialog.open(GameInfoComponent, {
      disableClose: false,
      height: '80vh',
      data: {
        game
      }
    });

    dialogRefAdd.afterClosed().subscribe(result => {
    });
  }
}
