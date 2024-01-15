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
import { MatPaginator, PageEvent } from '@angular/material/paginator';
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
import { UserBoard } from 'src/app/models/userBoard.model';
import { Router } from '@angular/router';
import { UserThread } from 'src/app/models/userThread.model';
import { Achievement } from 'src/app/models/achievement.model';
import { FilterFormPopUpComponent } from '../filter-form-pop-up/filter-form-pop-up.component';

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
  userAchievements: UserAchievement[];
  userAchievementsLoaded: boolean = false;
  achievementsLoaded: boolean = false;
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

    if (this.currentTabIndex == 0 && this.userThreadsLoaded == false) {

      await this.loadAllThreadNames();
      await this.loadUserThreads();

    } else if (this.currentTabIndex == 1 && this.userBoardsLoaded == false) {

      await this.loadAllBoardNames();
      await this.loadUserBoards();

    } else if (this.currentTabIndex == 2) {

      await this.loadAllGames();
      await this.loadAllGameNames();
      await this.loadAllUserGames();

    } else if (this.currentTabIndex == 3 && this.userAchievementsLoaded == false) {

      await this.loadAllGameNames();
      await this.loadAchievementNames();
      await this.loadAllUserAchievements();
      await this.loadAllAchievementsBasedOnUserAchievements();

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
    //patch search forms with userID for each collection
    this.userAchievementSearchCriteria.controls.userID.setValue(data.userID);
    this.userGameSearchCriteria.controls.userID.setValue(data.userID);
    this.boardSearchCriteria.controls.userID.patchValue(data.userID);
    this.threadSearchCriteria.controls.userID.patchValue(data.userID);
    this.userLoaded = true;
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
          } else {
            this.userGames = result.data;
            this.totalUserGames = result.gameCount;
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
    } catch (err) {
      console.error(err);
      this.userGames = [];
      this.snackBar.open('Error loading user games.', 'dismiss', {
        duration: 2000
      });
    }
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
        if (result != undefined) {
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
      this.achievementsLoaded = false;
      await this.loadAllUserAchievements();
      await this.loadAllAchievementsBasedOnUserAchievements();
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
      this.userAchievementsLoaded = false;
      this.achievementsLoaded = false;
      await this.loadAllUserAchievements();
      await this.loadAllAchievementsBasedOnUserAchievements();
    } catch (err) {
      console.error(err);
      this.userAchievements = [];
      this.achievements = [];
      this.snackBar.open('Error loading all user achievements.', 'dismiss', {
        duration: 2000
      });
    }
  }

  async loadAllUserAchievements() {
    try {
      if (!this.userAchievementsLoaded) {
        let result = await lastValueFrom(this.userAchievementService.getAll(this.userAchievementSearchCriteria.value).pipe());
        if (result != null && result != undefined) {
          if (result != undefined && result === 'No data in userAchievement table to fetch.') {
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
      this.snackBar.open('Error loading user achievements.', 'dismiss', {
        duration: 2000
      });
    }
  }

  async loadAllAchievementsBasedOnUserAchievements() {
    try {
      if (!this.achievementsLoaded && this.userAchievements != undefined && this.userAchievements.length > 0) {
        let userAchievements = this.userAchievements;
        let achievementIDs: any[] = [];
        for (let userAchievement of userAchievements) {
          if (!achievementIDs.includes(userAchievement.achievementID)) {
            achievementIDs.push(userAchievement.achievementID);
          }
        }
        let achievementIDsString: string = ``;
        for (let i = 0; i < achievementIDs.length; i++) {
          if (i == (achievementIDs.length - 1)) {
            achievementIDsString += `${achievementIDs[i]}`;
          } else {
            achievementIDsString += `${achievementIDs[i]},`
          }
        }
        let result = await lastValueFrom(this.achievementService.getAllBasedOnIDList(achievementIDsString).pipe());
        if (result != null && result != undefined) {
          if (result != undefined && result === 'No data in achievement table to fetch.') {
            this.achievements = [];
          } else {
            this.achievements = result;
            for (let userAchievement of this.userAchievements) {
              let findAchievement = this.achievements.find(obj => obj.achievementID == userAchievement.achievementID);
              if (findAchievement != undefined) {
                userAchievement.achievementIcon = findAchievement.achievementIcon;
                userAchievement.achievementDescription = findAchievement.achievementDescription;
              }
            }
          }
          this.achievementsLoaded = true;
        }
      } else {
        this.achievementsLoaded = true;
      }
    } catch (err) {
      console.error(err);
      this.userGames = [];
      this.snackBar.open('Error loading achievements.', 'dismiss', {
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

    dialogRef.afterClosed().subscribe(async result => {
      if (result !== undefined) {
        await this.clearAchievementSearch();
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

  public handleAchievementDeleteResponse(data: any) {
    if (data !== null) {
      this.ngAfterViewInit();
    } else {
      this.ngAfterViewInit();
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

  async loadUserBoards() {
    try {
      if (!this.userBoardsLoaded) {
        let result = await lastValueFrom(this.userBoardService.getAll(this.boardSearchCriteria.value).pipe());
        if (result != null && result != undefined) {
          if (result != undefined && result === 'No data in userBoard table to fetch.') {
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

  openBoard(board: Board) {
    this.router.navigate([`/board/${board.boardID}`], { state: { board: board, user: this.user } });
  }

  async unfollowBoard(userBoard: UserBoard) {
    if (userBoard !== undefined) {
      this.userBoardService.delete(userBoard?.userBoardID).subscribe({
        next: this.handleUnfollowResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
      this.snackBar.open('Successfully unfollowed a board!', 'dismiss', {
        duration: 3000
      });
    } else {
      this.snackBar.open('Unfollow was not successful: User Board was undefined.', 'dismiss', {
        duration: 3000
      });
    }
  }

  async handleUnfollowResponse(data: any) {
    if (data !== null) {
      this.userBoardsLoaded = false;
      await this.loadUserBoards();
    }
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

  async loadUserThreads() {
    try {
      if (!this.userThreadsLoaded) {
        let result = await lastValueFrom(this.userThreadService.getAll(this.threadSearchCriteria.value).pipe());
        if (result != null && result != undefined) {
          if (result != undefined && result === 'No data in userThread table to fetch.') {
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

  openThread(thread: Thread) {
    this.router.navigate([`/thread/${thread.threadID}`], { state: { thread } });
  }

  async unfollowThread(userThread: UserThread) {
    if (userThread !== undefined) {
      this.userThreadService.delete(userThread?.userThreadID).subscribe({
        next: this.handleUnfollowThreadResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
      this.snackBar.open('Successfully unfollowed a thread!', 'dismiss', {
        duration: 3000
      });
    } else {
      this.snackBar.open('Unfollow was not successful: User Thread was undefined.', 'dismiss', {
        duration: 3000
      });
    }
  }

  async handleUnfollowThreadResponse(data: any) {
    if (data !== null) {
      this.userThreadsLoaded = false;
      await this.loadUserThreads();
    }
  }

}
