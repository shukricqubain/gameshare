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
import { catchError, map, merge, startWith, switchMap, of as observableOf } from 'rxjs';
import { UserAchievement } from 'src/app/models/userAchievement.model';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AddUserAchievementComponent } from './add-user-achievement/add-user-achievement.component';
import { UserAchievementService } from 'src/app/services/userAchievement.service';

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
    private userGameService: UserGameService,
    private dateFunction: DateFunctionsService,
    private userAchievementService: UserAchievementService,
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

  gameSearchCriteria = new FormGroup({
    searchTerm: new FormControl(''),
    sort: new FormControl('userGameID', [Validators.required]),
    pagination: new FormControl('true', [Validators.required]),
    direction: new FormControl('asc', [Validators.required]),
    limit: new FormControl(5, [Validators.required]),
    page: new FormControl(0, [Validators.required])
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
    page: new FormControl(0, [Validators.required])
  });

  displayedUserAchievementColumns: string[] = ['userAchievementID', 'achievementName', 'gameID', 'gameName', 'userID', 'achievementStatus', 'createdAt', 'updatedAt', 'actions'];
  userAchievementDataSource = new MatTableDataSource<any>;
  userAchievementData: UserAchievement[];
  achievementPageSize = 5;
  currentAchievementPage = 0;
  achievementResultsLength = 0;

  @ViewChild('achievementPaginator') achievementPaginator: MatPaginator;
  @ViewChild('achievementSort') achievementSort: MatSort;

  private currentTabIndex = 0;

  async ngAfterViewInit() {
    if(this.currentTabIndex == 0 && this.gamesLoaded == false){
      let data: any = this.location.getState();
      await this.loadAllGameNames();
      if (data !== null) {
        await this.loadUserDetails(data);
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
      } else {
        this.snackBar.open('An error occured while trying to load user profile with id of ``', 'dismiss',{
          duration: 3000
        });
      }
    } else if(this.currentTabIndex == 1){
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
            return data.data;
          }),
        )
        .subscribe(data => (this.userAchievementDataSource = data));
        this.changeForm();
    } else if(this.currentTabIndex == 2){
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
    await this.userService.get(data.userID).subscribe({
      next: this.handleGetResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
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

  public handleSearchResponse(data: any) {
    if (data == null) {
      this.userGamesDataSource.data = [];
      this.gameResultsLength = 0;
      this.gamesLoaded = false;
      this.ngAfterViewInit();
    } else {
      this.userGamesDataSource.data = data.data;
      this.gameResultsLength = data.user_count;
      this.gamesLoaded = false;
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
          next: this.handleDeleteResponse.bind(this),
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

  public handleDeleteResponse(data:any){
    if(data == null){
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
        this.ngAfterViewInit();
      } else {
        this.ngAfterViewInit();
      }
    });
  }

  public applyGameSearch = async () => {
    this.userGameService.getAll(this.gameSearchCriteria.value).subscribe({
      next: this.handleSearchResponse.bind(this),
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
    
  }

  public clearGameSearch() {
    this.gameSearchCriteria.controls.searchTerm.patchValue('');
    this.gameSearchCriteria.controls.sort.patchValue('gameID');
    this.gameSearchCriteria.controls.pagination.patchValue('true');
    this.gameSearchCriteria.controls.direction.patchValue('asc');
    this.gameSearchCriteria.controls.limit.patchValue(5);
    this.gameSearchCriteria.controls.page.patchValue(0);
    this.userGameService.getAll(this.gameSearchCriteria.value).subscribe({
      next: this.handleSearchResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

  async loadAllGameNames(){
    await this.gameService.getAllGameNames().subscribe({
      next: this.handleGetAllNamesResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

  handleGetAllNamesResponse(data: any){
    if (data !== null && data !== undefined) {
      this.allGameNames = data;
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
  }

  deleteUserAchievement(element: any){
  }
}
