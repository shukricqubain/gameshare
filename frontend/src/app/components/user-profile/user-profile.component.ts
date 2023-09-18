import { Component, ViewChild } from '@angular/core';
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
    private userGameService: UserGameService,
    private dateFunction: DateFunctionsService,
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

  searchCriteria = new FormGroup({
    searchTerm: new FormControl(''),
    sort: new FormControl('userGameID', [Validators.required]),
    pagination: new FormControl('true', [Validators.required]),
    direction: new FormControl('asc', [Validators.required]),
    limit: new FormControl(5, [Validators.required]),
    page: new FormControl(0, [Validators.required])
  });

  displayedUserGamesColumns: string[] = ['userGameID', 'gameID', 'gameEnjoymentRating','createdAt', 'updatedAt', 'actions'];
  userGamesDataSource = new MatTableDataSource<any>;
  userGamesData: UserGame[];
  search: any;
  pageSize = 5;
  currentPage = 0;
  resultsLength = 0;
  isLoadingResults: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  async ngOnInit() {
    let data: any = this.location.getState();
    if (data !== null) {
      await this.loadUserDetails(data);
      await this.loadUserGames();
      this.changeForm();
    } else {
      this.snackBar.open('An error occured while trying to load user profile with id of ``', 'dismiss',{
        duration: 3000
      });
    }
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

  async loadUserGames(){
    await this.userGameService.getAll(this.searchCriteria.value).subscribe({
      next: this.handleGetUserGames.bind(this),
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
      this.resultsLength = 0;
    } else {
      this.userGamesDataSource.data = data.data;
      this.resultsLength = data.user_count;
    }
  }

  public handleSearchResponse(data: any) {
    if (data == null) {
      this.userGamesDataSource.data = [];
      this.resultsLength = 0;
    } else {
      this.userGamesDataSource.data = data.data;
      this.resultsLength = data.user_count;
    }
  }

  editUserGame(element: any){
    
  }

  deleteUserGame(element: any){
    
  }

  public formatDate(date: any) {
    let formattedDate = this.dateFunction.formatDate(date);
    return formattedDate;
  }

  addUserGame(){
    const dialogRef = this.matDialog.open(AddUserGameComponent, {
      width: '100%',
      data: {
        isEdit: false,
        userID: this.user.userID
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.ngOnInit();
      } else {
        this.ngOnInit();
      }
    });
  }

  public applySearch = async () => {
    this.userGameService.getAll(this.searchCriteria.value).subscribe({
      next: this.handleSearchResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

  public clearSearch() {
    this.searchCriteria.controls.searchTerm.patchValue('');
    this.searchCriteria.controls.sort.patchValue('gameID');
    this.searchCriteria.controls.pagination.patchValue('true');
    this.searchCriteria.controls.direction.patchValue('asc');
    this.searchCriteria.controls.limit.patchValue(5);
    this.searchCriteria.controls.page.patchValue(0);
    this.userGameService.getAll(this.searchCriteria.value).subscribe({
      next: this.handleSearchResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }
}
