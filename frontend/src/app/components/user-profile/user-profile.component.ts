import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { MatSnackBar } from "@angular/material/snack-bar";
import { UserService } from 'src/app/services/user.service';
import { UsernameService } from 'src/app/services/username.service';
import { RoleService } from 'src/app/services/roleID.service';
import { UserGameService } from 'src/app/services/userGame.service';
import { PageEvent } from '@angular/material/paginator';
import { DateFunctionsService } from 'src/app/services/dateFunctions.service';
import { AddUserGameComponent } from './user-game/add-user-game/add-user-game.component';
import { MatDialog } from '@angular/material/dialog';
import { GameName } from 'src/app/models/gameName.model';
import { GameService } from 'src/app/services/game.service';
import { of as observableOf, lastValueFrom, last } from 'rxjs';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { UserAchievementService } from 'src/app/services/userAchievement.service';
import { AchievementName } from 'src/app/models/achievementName.model';
import { AchievementService } from 'src/app/services/achievement.service';
import { Board } from 'src/app/models/board.model';
import { UserBoardService } from 'src/app/services/userBoard.service';
import { AddUserBoardComponent } from './user-board/add-user-board/add-user-board.component';
import { BoardService } from 'src/app/services/board.service';
import { Thread } from 'src/app/models/thread.model';
import { ThreadService } from 'src/app/services/thread.service';
import { UserThreadService } from 'src/app/services/userThread.service';
import { AddUserThreadComponent } from './user-thread/add-user-thread/add-user-thread.component';
import { Router } from '@angular/router';
import { Achievement } from 'src/app/models/achievement.model';
import { FilterFormPopUpComponent } from '../filter-form-pop-up/filter-form-pop-up.component';
import { ProfilePicturePopUpComponent } from './profile-picture-pop-up/profile-picture-pop-up.component';

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
    private matDialog: MatDialog,
    private router: Router,
  ) {
  }

  /* User Form Section */
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
    profilePicture: new FormControl(''),
    createdAt: new FormControl(''),
    updatedAt: new FormControl('')
  });
  showPassword: boolean = false;
  editEnabled: boolean = false;
  enableMessage: string = `Enable the form for updation.`;
  userLoaded: boolean = false;
  minDate: Date;
  emailValidation = '^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$';

  /** User Game Form Section */
  userGameSearchCriteria = new FormGroup({
    searchTerm: new FormControl(''),
    sort: new FormControl('userGameID', [Validators.required]),
    pagination: new FormControl('true', [Validators.required]),
    direction: new FormControl('asc', [Validators.required]),
    limit: new FormControl(5, [Validators.required]),
    page: new FormControl(0, [Validators.required]),
    userID: new FormControl('')
  });
  userGamesPageSize = 5;
  userGamesPageIndex = 0;
  totalUserGames = 0;
  hasGames: boolean = false;

  allGameNames: GameName[] = [];
  userGames: any[] = [];
  allGames: any[] = [];
  gamesLoaded: boolean = false;
  userGamesLoaded: boolean = false;
  gameNamesLoaded: boolean = false;

  /** User Achievement Form Section */
  userAchievementSearchCriteria = new FormGroup({
    searchTerm: new FormControl(''),
    sort: new FormControl('userAchievementID', [Validators.required]),
    pagination: new FormControl('true', [Validators.required]),
    direction: new FormControl('asc', [Validators.required]),
    limit: new FormControl(5, [Validators.required]),
    page: new FormControl(0, [Validators.required]),
    userID: new FormControl('')
  });

  userAchievementsPageSize = 5;
  userAchievementsPageIndex = 0;
  totalUserAchievements = 0;
  userAchievements: any[];
  userAchievementsLoaded: boolean = false;
  achievements: Achievement[];
  allAchievementNames: AchievementName[] = [];
  achievementNamesLoaded: boolean = false;

  /** User Boards Form Section */
  userBoards: Board[];
  boardSearchCriteria = new FormGroup({
    searchTerm: new FormControl(''),
    sort: new FormControl('userBoardID', [Validators.required]),
    pagination: new FormControl('true', [Validators.required]),
    direction: new FormControl('asc', [Validators.required]),
    limit: new FormControl(5, [Validators.required]),
    page: new FormControl(0, [Validators.required]),
    userID: new FormControl('')
  });
  userBoardsPageSize = 5;
  userBoardsPageIndex = 0;
  totalUserBoards = 0;
  allBoardNames: Board[] = [];
  userBoardsLoaded: boolean = false;

  /** User Thread Form Section */
  threadSearchCriteria = new FormGroup({
    searchTerm: new FormControl(''),
    sort: new FormControl('userThreadID', [Validators.required]),
    pagination: new FormControl('true', [Validators.required]),
    direction: new FormControl('asc', [Validators.required]),
    limit: new FormControl(5, [Validators.required]),
    page: new FormControl(0, [Validators.required]),
    userID: new FormControl('')
  });
  userThreadsPageSize = 5;
  userThreadsPageIndex = 0;
  totalUserThreads = 0;
  userThreadsLoaded: boolean = false;
  userThreads: Thread[] = [];
  allThreadNames: Thread[] = [];

  private currentTabIndex = 0;

  async ngAfterViewInit() {

    let data: any = this.location.getState();
    await this.loadUserDetails(data);
    ///setup minimum date of birth for user to be 13
    let currentDate = new Date();
    let year = currentDate.getFullYear() - 13;
    let month = currentDate.getMonth() + 1;
    let day = currentDate.getDate();
    this.minDate = new Date(`${year}-${month}-${day}`);

    if (this.currentTabIndex == 0 && this.userThreadsLoaded == false) {

      await this.loadAllThreadNames();
      await this.loadUserThreads();

    } else if (this.currentTabIndex == 1 && this.userBoardsLoaded == false) {

      await this.loadAllBoardNames();
      await this.loadUserBoards();

    } else if (this.currentTabIndex == 2) {

      await this.loadAllGameNames();
      await this.loadAllUserGames();

    } else if (this.currentTabIndex == 3 && this.userAchievementsLoaded == false) {

      await this.loadAllGameNames();
      await this.loadAchievementNames();
      await this.loadAllUserAchievements();

    } else if (this.currentTabIndex == 4) {

      this.changeForm();

    }

  }

  public formatDate(date: any) {
    let formattedDate = this.dateFunction.formatDateMMDDYYYY(date);
    return formattedDate;
  }

  public onSelectedIndexChange(tabIndex: number) {
    this.currentTabIndex = tabIndex;
  }

  public onSelectedTabChange(matTabChangeEvent: MatTabChangeEvent) {
    this.ngAfterViewInit();
  }

  /** User Section */
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
    try {
    
      if(!this.userLoaded){

        if (data.userID == undefined) {
          let userName = localStorage.getItem('userName');
          if (userName !== null) {
            let result = await lastValueFrom(this.userService.getUserByName(userName).pipe());
            this.setupUser(result);
          }
        } else {
          let result = await lastValueFrom(this.userService.get(data.userID).pipe());
          this.setupUser(result)
        }
      }
    } catch(err){
      console.error(err);
      this.userGames = [];
      this.hasGames = false;
      this.snackBar.open('Error loading user details.', 'dismiss', {
        duration: 2000
      });
    }
  }

  setupUser(data: any){
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
    this.userProfileForm.controls.profilePicture.setValue(data.profilePicture ? data.profilePicture: '');
    this.userProfileForm.controls.createdAt.setValue(data.createdAt ? data.createdAt : '');
    this.userProfileForm.controls.updatedAt.setValue(data.updatedAt ? data.updatedAt : '');
    //patch search forms with userID for each collection
    this.userAchievementSearchCriteria.controls.userID.setValue(data.userID);
    this.userGameSearchCriteria.controls.userID.setValue(data.userID);
    this.boardSearchCriteria.controls.userID.patchValue(data.userID);
    this.threadSearchCriteria.controls.userID.patchValue(data.userID);
    this.userLoaded = true;
  }

  updateProfileImage(){
    const dialogRefAdd = this.matDialog.open(ProfilePicturePopUpComponent, {
      disableClose: false,
      data: {
        form: this.userProfileForm
      }
    });

    dialogRefAdd.afterClosed().subscribe(async result => {
      if(result != undefined && result.event != undefined && result.event === 'Update profile picture.'){
        this.userLoaded = false;
        let userID = this.userProfileForm.controls.userID.value;
        await this.loadUserDetails(userID);
      }
      
    });
  }

  /** User Game Section */
  async applyUserGameSearch() {
    this.userGamesLoaded = false;
    await this.loadAllUserGames();
  }

  async clearGameSearch() {
    this.userGameSearchCriteria.controls.searchTerm.patchValue('');
    this.userGameSearchCriteria.controls.sort.patchValue('gameID');
    this.userGameSearchCriteria.controls.pagination.patchValue('true');
    this.userGameSearchCriteria.controls.direction.patchValue('asc');
    this.userGameSearchCriteria.controls.limit.patchValue(5);
    this.userGameSearchCriteria.controls.page.patchValue(0);
    this.userGamesPageIndex = 0;
    this.userGamesPageSize = 5;
    this.userGamesLoaded = false;
    await this.loadAllUserGames();
  }

  async loadAllUserGames() {
    try {
      if (!this.userGamesLoaded) {
        let result = await lastValueFrom(this.userGameService.getAll(this.userGameSearchCriteria.value).pipe());
        if (result != null && result != undefined) {
          if (result != undefined && result === 'No data in userGame table to fetch.') {
            this.totalUserGames = 0;
            this.userGames = [];
            this.hasGames = false;
          } else {
            this.userGames = result.data;
            this.totalUserGames = result.gameCount;
            this.hasGames = true;
          }
          this.userGamesLoaded = true;
        }
      }
    } catch (err) {
      console.error(err);
      this.userGames = [];
      this.hasGames = false;
      this.snackBar.open('Error loading user games.', 'dismiss', {
        duration: 2000
      });
    }
  }

  async loadGameEvent(loadGameEvent?: any){
    this.userGamesLoaded = false;
    this.userAchievementsLoaded = false;
    await this.loadAllUserGames();
    await this.loadAllUserAchievements();
  }

  async loadAllGameNames() {
    if (!this.gameNamesLoaded) {
      this.gameService.getAllGameNames().subscribe({
        next: this.handleGetAllNamesResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    }
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
        this.userAchievementsLoaded = false;
        await this.loadAllUserGames();
        await this.loadAllUserAchievements();
      }
    });
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

  onUserGamesPageChange(event: PageEvent) {
    this.userGamesPageIndex = event.pageIndex;
    this.userGamesPageSize = event.pageSize;
    this.userGameSearchCriteria.controls.page.patchValue(this.userGamesPageIndex);
    this.userGameSearchCriteria.controls.limit.patchValue(this.userGamesPageSize);
    this.userGamesLoaded = false;
    this.loadAllUserGames();
  }

  /** User Achievement Section */
  applyAchievementSearch = async () => {
    try {
      this.userAchievementsLoaded = false;
      await this.loadAllUserAchievements();
    } catch (err) {
      console.error(err);
      this.userAchievements = [];
      this.achievements = [];
      this.snackBar.open('Error loading all user achievements.', 'dismiss', {
        duration: 2000
      });
    }
  }

  public async clearAchievementSearch() {
    try {
      this.userAchievementSearchCriteria.controls.searchTerm.patchValue('');
      this.userAchievementSearchCriteria.controls.sort.patchValue('userAchievementID');
      this.userAchievementSearchCriteria.controls.pagination.patchValue('true');
      this.userAchievementSearchCriteria.controls.direction.patchValue('asc');
      this.userAchievementSearchCriteria.controls.limit.patchValue(5);
      this.userAchievementSearchCriteria.controls.page.patchValue(0);
      this.userAchievementsPageIndex = 0;
      this.userAchievementsPageSize = 5;
      this.userAchievementsLoaded = false;
      await this.loadAllUserAchievements();
    } catch (err) {
      console.error(err);
      this.userAchievements = [];
      this.totalUserAchievements = 0;
      this.achievements = [];
      this.snackBar.open('Error loading all user achievements.', 'dismiss', {
        duration: 2000
      });
    }
  }

  async loadAllUserAchievements(loadAchievementEvent?: any) {
    try {
      if (!this.userAchievementsLoaded || loadAchievementEvent != undefined) {
        let result = await lastValueFrom(this.userAchievementService.getAll(this.userAchievementSearchCriteria.value).pipe());
        if (result != null && result != undefined) {
          if (result != undefined && result.message === 'No data in user achievement table to fetch.') {
            this.userAchievements = [];
            this.totalUserAchievements = 0;
          } else {
            this.userAchievements = result.data;
            this.totalUserAchievements = result.achievementCount;
          }
          this.userAchievementsLoaded = true;
        }
      }
    } catch (err) {
      console.error(err);
      this.userGames = [];
      this.hasGames = false;
      this.snackBar.open('Error loading user achievements.', 'dismiss', {
        duration: 2000
      });
    }
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

  filterForm() {
    const dialogRefAdd = this.matDialog.open(FilterFormPopUpComponent, {
      disableClose: false,
      data: {
        model: 'UserAchievement',
        form: this.userAchievementSearchCriteria.value
      }
    });

    dialogRefAdd.afterClosed().subscribe(result => {

      ///if form was submitted we check if the search criteria are different and apply a search
      if (result != undefined && result.event != undefined && result.event != null && result.event === 'Filter Adjusted') {
        let currentSearch = JSON.stringify(this.userAchievementSearchCriteria.value);
        let newSearch = JSON.stringify(result.data.value);
        if (currentSearch !== newSearch) {
          this.userAchievementSearchCriteria = result.data;
          this.applyAchievementSearch();
        }
      }
    });
  }

  onUserAchievementsPageChange(event: PageEvent) {
    this.userAchievementsPageIndex = event.pageIndex;
    this.userAchievementsPageSize = event.pageSize;
    this.userAchievementSearchCriteria.controls.page.patchValue(this.userAchievementsPageIndex);
    this.userAchievementSearchCriteria.controls.limit.patchValue(this.userAchievementsPageSize);
    this.userAchievementsLoaded = false;
    this.loadAllUserAchievements();
  }

  /** User Board Section */
  applyBoardSearch() {
    this.userBoardsLoaded = false;
    let trimmedSearch = this.boardSearchCriteria.controls.searchTerm.value?.trim();
    if (trimmedSearch !== undefined && trimmedSearch !== null) {
      this.boardSearchCriteria.controls.searchTerm.patchValue(trimmedSearch);
      this.userBoardService.getAll(this.boardSearchCriteria.value).subscribe({
        next: this.handleBoardSearchResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    }
  }

  clearBoardSearch() {
    this.boardSearchCriteria.controls.searchTerm.patchValue('');
    this.boardSearchCriteria.controls.sort.patchValue('userBoardID');
    this.boardSearchCriteria.controls.pagination.patchValue('true');
    this.boardSearchCriteria.controls.direction.patchValue('asc');
    this.boardSearchCriteria.controls.limit.patchValue(5);
    this.boardSearchCriteria.controls.page.patchValue(0);
    this.userBoardsPageIndex = 0;
    this.userBoardsPageSize = 5;
    this.userBoardsLoaded = false;
    this.userBoardService.getAll(this.boardSearchCriteria.value).subscribe({
      next: this.handleBoardSearchResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

  handleBoardSearchResponse(data: any) {
    if (data == null || data.message === 'No data in userBoard table to fetch.') {
      this.userBoards = [];
      this.totalUserBoards = 0;
    } else {
      this.userBoards = data.data;
      this.totalUserBoards = data.userBoardCount;
    }
    this.userBoardsLoaded = true;
  }

  async loadUserBoards(unfollowEvent?: any) {
    try {
      if (!this.userBoardsLoaded || unfollowEvent != undefined) {
        let result = await lastValueFrom(this.userBoardService.getAll(this.boardSearchCriteria.value).pipe());
        if (result != null && result != undefined) {
          if (result != undefined && result.message === 'No data in userBoard table to fetch.') {
            this.userBoards = [];
            this.totalUserBoards = 0;
          } else {
            this.userBoards = result.data;
            this.totalUserBoards = result.userBoardCount;
          }
          this.userBoardsLoaded = true;
        }
      }
    } catch (err) {
      console.error(err);
      this.userGames = [];
      this.hasGames = false;
      this.snackBar.open('Error loading user boards.', 'dismiss', {
        duration: 2000
      });
    }
  }

  async loadAllBoardNames() {
    try {
      if (!this.userBoardsLoaded) {
        this.allBoardNames = await lastValueFrom(this.boardService.getAllBoardNames().pipe());
      }
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

  addUserBoard() {
    const dialogRef = this.matDialog.open(AddUserBoardComponent, {
      width: '100%',
      data: {
        isEdit: false,
        userID: this.user.userID,
        allBoardNames: this.allBoardNames
      }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result !== undefined) {
        this.userBoardsLoaded = false;
        await this.loadUserBoards();
      }
    });
  }

  onUserBoardsPageChange(event: PageEvent) {
    this.userBoardsPageIndex = event.pageIndex;
    this.userBoardsPageSize = event.pageSize;
    this.boardSearchCriteria.controls.page.patchValue(this.userBoardsPageIndex);
    this.boardSearchCriteria.controls.limit.patchValue(this.userBoardsPageSize);
    this.userBoardsLoaded = false;
    this.loadUserBoards();
  }

  /** User Thread Section */
  applyThreadSearch() {
    this.userThreadsLoaded = false;
    let trimmedSearch = this.threadSearchCriteria.controls.searchTerm.value?.trim();
    if (trimmedSearch !== undefined && trimmedSearch !== null) {
      this.threadSearchCriteria.controls.searchTerm.patchValue(trimmedSearch);
      this.userThreadService.getAll(this.threadSearchCriteria.value).subscribe({
        next: this.handleThreadSearchResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    }
  }

  clearThreadSearch() {
    this.threadSearchCriteria.controls.searchTerm.patchValue('');
    this.threadSearchCriteria.controls.sort.patchValue('userThreadID');
    this.threadSearchCriteria.controls.pagination.patchValue('true');
    this.threadSearchCriteria.controls.direction.patchValue('asc');
    this.threadSearchCriteria.controls.limit.patchValue(5);
    this.threadSearchCriteria.controls.page.patchValue(0);
    this.userThreadsPageIndex = 0;
    this.userThreadsPageSize = 5;
    this.userThreadsLoaded = false;
    this.userThreadService.getAll(this.threadSearchCriteria.value).subscribe({
      next: this.handleThreadSearchResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

  handleThreadSearchResponse(data: any) {
    if (data == null || data.message === 'No data in userThread table to fetch.') {
      this.userThreads = [];
    } else {
      this.userThreads = data.data;
    }
    this.userThreadsLoaded = true;
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

  addUserThread() {
    const dialogRef = this.matDialog.open(AddUserThreadComponent, {
      width: '100%',
      data: {
        isEdit: false,
        userID: this.user.userID,
        allThreadNames: this.allThreadNames
      }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result !== undefined) {
        this.userThreadsLoaded = false;
        await this.loadUserThreads();
      }
    });
  }

  onUserThreadsPageChange(event: PageEvent) {
    this.userThreadsPageIndex = event.pageIndex;
    this.userThreadsPageSize = event.pageSize;
    this.threadSearchCriteria.controls.page.patchValue(this.userThreadsPageIndex);
    this.threadSearchCriteria.controls.limit.patchValue(this.userThreadsPageSize);
    this.userThreadsLoaded = false;
    this.loadUserThreads();
  }

  async loadUserThreads(unfollowEvent?: any) {
    try {
      if (!this.userThreadsLoaded || (unfollowEvent != undefined && unfollowEvent === 'unfollowedThread')) {
        let result = await lastValueFrom(this.userThreadService.getAll(this.threadSearchCriteria.value).pipe());
        if (result != null && result != undefined) {
          if (result != undefined && result.message === 'No data in userThread table to fetch.') {
            this.userThreads = [];
            this.totalUserThreads = 0;
          } else {
            this.userThreads = result.data;
            this.totalUserThreads = result.userThreadCount;
          }
          this.userThreadsLoaded = true;
        }
      }
    } catch (err) {
      console.error(err);
      this.userThreads = [];
      this.snackBar.open('Error loading user threads.', 'dismiss', {
        duration: 2000
      });
    }
  }

}
