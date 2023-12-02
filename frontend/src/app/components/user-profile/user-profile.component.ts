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
import { PopUpComponent } from 'src/app/pop-up/pop-up.component';
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
    userRole: new FormControl('', [Validators.required]),
    userPassword: new FormControl('', [Validators.required]),
    createdAt: new FormControl(''),
    updatedAt: new FormControl('')
  });
  showPassword: boolean = false;
  editEnabled: boolean = false;
  enableMessage: string = `Enable the form for updation.`;
  userLoaded: boolean = false;

  gameSearchCriteria = new FormGroup({
    searchTerm: new FormControl(''),
    sort: new FormControl('userGameID', [Validators.required]),
    pagination: new FormControl('true', [Validators.required]),
    direction: new FormControl('asc', [Validators.required]),
    limit: new FormControl(5, [Validators.required]),
    page: new FormControl(0, [Validators.required]),
    userID: new FormControl('')
  });

  displayedUserGamesColumns: string[] = ['userGameID', 'gameName', 'gameEnjoymentRating','createdAt', 'updatedAt', 'actions'];
  userGamesDataSource = new MatTableDataSource<any>;
  userGamesData: UserGame[];
  search: any;
  pageSize = 5;
  currentPage = 0;
  gameResultsLength = 0;
  isLoadingResults: boolean = false;
  allGameNames: GameName[] = [];
  gamesLoaded: boolean = false;

  @ViewChild('gamePaginator') gamePaginator: MatPaginator;
  @ViewChild('gameSort') gameSort: MatSort;

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

  @ViewChild('achievementPaginator') achievementPaginator: MatPaginator;
  @ViewChild('achievementSort') achievementSort: MatSort;

  displayedUserBoardColumns: string[] = ['userBoardID', 'boardName', 'userID', 'gameID', 'gameName', 'createdAt', 'updatedAt', 'actions'];
  userBoardsDataSource = new MatTableDataSource<any>;
  boardData: Board[];
  boardPageSize = 5;
  currentBoardPage = 0;
  boardResultsLength = 0;

  @ViewChild(MatPaginator) boardPaginator: MatPaginator;
  @ViewChild(MatSort) boardSort: MatSort;

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

  async ngAfterViewInit() {

    let data: any = this.location.getState();
    if(this.userLoaded == false && data !== null){
      await this.loadUserDetails(data);
    } else if(data == null){
      this.snackBar.open('An error occured while trying to load user profile with id of ``', 'dismiss',{
        duration: 3000
      });
    }

    if(this.currentTabIndex == 0 && this.boardsLoaded == false){
     
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
      
    } else if(this.currentTabIndex == 1 && this.gamesLoaded == false){
      
      await this.loadAllGameNames();
      this.userGamesDataSource.sort = this.gameSort;
      ///if user changes the sort order reset the page back to the first page
      this.gameSort.sortChange.subscribe(() => (this.gamePaginator.pageIndex = 0));
      merge(this.gameSort.sortChange, this.gamePaginator.page, this.gamePaginator.pageSize)
        .pipe(
          startWith({}),
          switchMap(() => {
            this.gameSearchCriteria.controls.sort.patchValue(this.gameSort.active);
            this.gameSearchCriteria.controls.direction.patchValue(this.gameSort.direction);
            this.gameSearchCriteria.controls.page.patchValue(this.gamePaginator.pageIndex);
            this.gameSearchCriteria.controls.limit.patchValue(this.gamePaginator.pageSize);
            return this.userGameService!.getAll(this.gameSearchCriteria.value).pipe(catchError(() => observableOf(null)));
          }),
          map(data => {
            if (data === null) {
              return [];
            }
            this.gameResultsLength = data.gameCount;
            this.gamesLoaded = true;
            return data.data;
          }),
        )
        .subscribe(data => (this.userGamesDataSource = data));
    } else if(this.currentTabIndex == 2){
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
            //this.achievementLoaded = true;
            return data.data;
          }),
        )
        .subscribe(data => (this.userAchievementDataSource = data));
        this.changeForm();
    } else if(this.currentTabIndex == 3){
      this.changeForm();
    }
    
  }

  public onSelectedIndexChange(tabIndex: number) {
    this.currentTabIndex = tabIndex;
  }

  public onSelectedTabChange(matTabChangeEvent: MatTabChangeEvent)  {
    this.ngAfterViewInit();
  }

  async onSubmit(){
    let initial_username = this.user.userName;
    let updated_username = this.userProfileForm.controls.userName.value;
    let initial_role = localStorage.getItem('roleID');
    let updated_role = this.userProfileForm.controls.userRole.value;
    if(initial_username !== null && updated_username !== null && initial_username !== updated_username){
      this.usernameService.setUsernameObs(updated_username);
    }
    if(initial_role !== null && updated_role !== null && initial_role !== updated_role){
      this.roleService.setRoleObs(updated_role);
      localStorage.setItem('roleID', updated_role);
    }
    await this.userService.update(this.userProfileForm.value).subscribe({
      next: this.handleUpdateResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

  handleUpdateResponse(data:any){
    this.snackBar.open(data.message, 'dismiss',{
      duration: 2000
    });
    this.editEnabled = false;
    this.changeForm();
  }

  handleErrorResponse(data:any){
    this.snackBar.open(data.message, 'dismiss',{
      duration: 2000
    });
  }

  changeForm(){
    if(this.editEnabled){
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

  async loadUserDetails(data: any){
    if(data.userID == undefined){
      let userName = localStorage.getItem('userName');
      if(userName !== null){
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

  handleGetResponse(data: any){
    this.user = data;
    this.userProfileForm.controls.userID.setValue(data.userID ? `${data.userID}` : '');
    this.userProfileForm.controls.userName.setValue(data.userName ? data.userName : '');
    this.userProfileForm.controls.firstName.setValue(data.firstName ? data.firstName : '');
    this.userProfileForm.controls.lastName.setValue(data.lastName ? data.lastName : '');
    this.userProfileForm.controls.dateOfBirth.setValue(data.dateOfBirth ? data.dateOfBirth: '');
    this.userProfileForm.controls.email.setValue(data.email ? data.email: '');
    this.userProfileForm.controls.phoneNumber.setValue(data.phoneNumber ? data.phoneNumber: '');
    this.userProfileForm.controls.userRole.setValue(data.userRole ? `${data.userRole}` : '');
    this.userProfileForm.controls.userPassword.setValue(data.userPassword ? data.userPassword: '');
    this.userProfileForm.controls.createdAt.setValue(data.createdAt ? data.createdAt: '');
    this.userProfileForm.controls.updatedAt.setValue(data.updatedAt ? data.updatedAt: '');
    //patch search forms with userID for games and achievement collections
    this.achievementSearchCriteria.controls.userID.setValue(data.userID);
    this.gameSearchCriteria.controls.userID.setValue(data.userID);
    this.boardSearchCriteria.controls.userID.patchValue(data.userID);
    this.userLoaded = true;
  }

  handleGetUserGames(data: any){
    if(data == null){
      this.userGamesDataSource.data = [];
      this.gameResultsLength = 0;
    } else {
      this.userGamesDataSource.data = data.data;
      this.gameResultsLength = data.user_count;
    }
  }

  public handleGameSearchResponse(data: any) {
    if (data == null) {
      this.userGamesDataSource.data = [];
      this.gameResultsLength = 0;
      this.ngAfterViewInit();
    } else {
      this.userGamesDataSource.data = data.data;
      this.gameResultsLength = data.gameCount;
      this.ngAfterViewInit();
    }
  }

  public handleAchievementSearchResponse(data: any){
    if(data == null){
      this.userAchievementDataSource.data = [];
      this.achievementResultsLength = 0;
      this.ngAfterViewInit();
    } else {
      this.userAchievementDataSource.data = data.data;
      this.achievementResultsLength = data.achievementCount;
      this.ngAfterViewInit();
    }
  }

  editUserGame(element: any){
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

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.gamesLoaded = false;
        this.ngAfterViewInit();
      } else {
        this.ngAfterViewInit();
      }
    });
  }

  deleteUserGame(element: any){
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
    if(game !== undefined){
      gameName = game.gameName ? game.gameName: '';
    } else {
      ///throw error
      this.snackBar.open(`No game with this ID found in the system.`, 'dismiss',{
        duration: 3000
      });
      return;
    }
  
    dialogRefDelete.afterClosed().subscribe(result => {
      if(result.event === 'delete'){
        this.userGameService.delete(element.userGameID).subscribe({
          next: this.handleGameDeleteResponse.bind(this),
          error: this.handleErrorResponse.bind(this)
        });
        this.snackBar.open(`${gameName} has been deleted.`, 'dismiss',{
          duration: 3000
        });
      } else {
        this.snackBar.open(`${gameName} has not been deleted.`, 'dismiss',{
          duration: 3000
        });
      }
    });
  }

  public handleGameDeleteResponse(data:any){
    if(data !== null){
      this.gamesLoaded = false;
      this.ngAfterViewInit();
    } else {
      this.ngAfterViewInit();
    }
  }

  public formatDate(date: any) {
    let formattedDate = this.dateFunction.formatDateMMDDYYYY(date);
    return formattedDate;
  }

  addUserGame(){
    const dialogRef = this.matDialog.open(AddUserGameComponent, {
      width: '100%',
      data: {
        isEdit: false,
        userID: this.user.userID,
        allGameNames: this.allGameNames
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.boardsLoaded = true;
        this.ngAfterViewInit();
      } else {
        this.ngAfterViewInit();
      }
    });
  }

  public applyGameSearch = async () => {
    this.gamesLoaded = false;
    this.userGameService.getAll(this.gameSearchCriteria.value).subscribe({
      next: this.handleGameSearchResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

  addUserAchievement(){
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
    this.userAchievementService.getAll(this.achievementSearchCriteria.value).subscribe({
      next: this.handleAchievementSearchResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

  public clearGameSearch() {
    this.gameSearchCriteria.controls.searchTerm.patchValue('');
    this.gameSearchCriteria.controls.sort.patchValue('gameID');
    this.gameSearchCriteria.controls.pagination.patchValue('true');
    this.gameSearchCriteria.controls.direction.patchValue('asc');
    this.gameSearchCriteria.controls.limit.patchValue(5);
    this.gameSearchCriteria.controls.page.patchValue(0);
    this.gamesLoaded = false;
    this.userGameService.getAll(this.gameSearchCriteria.value).subscribe({
      next: this.handleGameSearchResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

  public clearAchievementSearch() {
    this.achievementSearchCriteria.controls.achievementSearchTerm.patchValue('');
    this.achievementSearchCriteria.controls.sort.patchValue('userAchievementID');
    this.achievementSearchCriteria.controls.pagination.patchValue('true');
    this.achievementSearchCriteria.controls.direction.patchValue('asc');
    this.achievementSearchCriteria.controls.limit.patchValue(5);
    this.achievementSearchCriteria.controls.page.patchValue(0);
    this.userAchievementService.getAll(this.achievementSearchCriteria.value).subscribe({
      next: this.handleAchievementSearchResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

  async loadAllGameNames(){
    if(!this.gameNamesLoaded){
      await this.gameService.getAllGameNames().subscribe({
        next: this.handleGetAllNamesResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    }
  }

  async loadAllBoardNames(){
    try{
      if(!this.boardsLoaded){
        this.allBoardNames = await lastValueFrom(this.boardService.getAllBoardNames().pipe());
      }
    } catch(err){
      this.snackBar.open('Error loading board names!', 'dismiss', {
        duration: 3000
      });
      console.log(err);
    }
  }

  handleGetAllBoardNamesResponse(data: any){
    if (data !== null && data !== undefined) {
      this.allBoardNames = data;
    }
  }

  handleGetAllNamesResponse(data: any){
    if (data !== null && data !== undefined) {
      this.allGameNames = data;
      this.gameNamesLoaded = false;
    }
  }

  getGameName(element: any){
    let gameName = this.allGameNames.find(obj => obj.gameID == element);
    if(gameName !== undefined){
      return gameName.gameName;
    } else {
      return 'No Game with this ID'
    }
  }

  editUserAchievement(element: any){
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

  deleteUserAchievement(element: any){
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
    if(achievement !== undefined){
      achievementName = achievement.achievementName ? achievement.achievementName: '';
    } else {
      ///throw error
      this.snackBar.open(`No achievement with this ID found in the system.`, 'dismiss',{
        duration: 3000
      });
      return;
    }
  
    dialogRefDelete.afterClosed().subscribe(result => {
      if(result.event === 'delete'){
        this.userAchievementService.delete(element.userAchievementID).subscribe({
          next: this.handleAchievementDeleteResponse.bind(this),
          error: this.handleErrorResponse.bind(this)
        });
        this.snackBar.open(`${achievementName} has been deleted.`, 'dismiss',{
          duration: 3000
        });
      } else {
        this.snackBar.open(`${achievementName} has not been deleted.`, 'dismiss',{
          duration: 3000
        });
      }
    });
  }

  async loadAchievementNames(){
    try{
      if(!this.achievementNamesLoaded){
        this.allAchievementNames = await lastValueFrom(this.achievementService.getAllAchievementsNames().pipe());
      }
    } catch(err){
      this.snackBar.open('Error loading achievement names!', 'dismiss', {
        duration: 3000
      });
      console.log(err);
    }
  }

  public handleAchievementDeleteResponse(data:any){
    if(data !== null){
      this.ngAfterViewInit();
    } else {
      this.ngAfterViewInit();
    }
  }

  applyBoardSearch(){
    this.boardsLoaded = false;
    let trimmedSearch = this.boardSearchCriteria.controls.boardSearchTerm.value?.trim();
    if(trimmedSearch !== undefined && trimmedSearch !== null){
      this.boardSearchCriteria.controls.boardSearchTerm.patchValue(trimmedSearch);
      this.userBoardService.getAll(this.boardSearchCriteria.value).subscribe({
        next: this.handleBoardSearchResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    }
    
  }

  clearBoardSearch(){
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

  handleBoardSearchResponse(data: any){
    if(data == null){
      this.userBoardsDataSource.data = [];
      this.boardResultsLength = 0;
      this.ngAfterViewInit();
    } else {
      this.userBoardsDataSource.data = data.data;
      this.boardResultsLength = data.userBoardCount;
      this.ngAfterViewInit();
    }
  }

  addUserBoard(){
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
        this.boardsLoaded = false;
        this.ngAfterViewInit();
      } else {
        this.ngAfterViewInit();
      }
    });
  }
}
