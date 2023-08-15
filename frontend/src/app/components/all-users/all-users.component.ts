import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule} from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {catchError, map, merge, Observable, of as observableOf, startWith, switchMap} from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { PopUpComponent } from 'src/app/pop-up/pop-up.component';
import { MatDialog } from '@angular/material/dialog';
import { AddUserComponent } from '../add-user/add-user.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})
export class AllUsersComponent implements AfterViewInit {

  displayedColumns: string[] = ['userID', 'userName', 'userRole', 'email', 'actions'];
  dataSource = new MatTableDataSource<any>;
  userData: User[];
  search: any;
  pageSize = 5;
  currentPage = 0;
  resultsLength = 0;
  isLoadingResults: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  searchCriteria = new FormGroup({
    searchTerm: new FormControl(''),
    sort: new FormControl('userID', [Validators.required]),
    pagination: new FormControl('true', [Validators.required]),
    direction: new FormControl('asc', [Validators.required]),
    limit: new FormControl(5, [Validators.required]),
    page: new FormControl(0, [Validators.required])
  });

  constructor(
    private userService: UserService,
    private changeDetectorRef: ChangeDetectorRef,
    private matDialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
  ){
  }

  async ngOnInit(){
  }

  async ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          // this.isLoadingResults = true;
          this.searchCriteria.controls.sort.patchValue(this.sort.active);
          this.searchCriteria.controls.direction.patchValue(this.sort.direction);
          this.searchCriteria.controls.page.patchValue(this.paginator.pageIndex);
          return this.userService!.getAll(this.searchCriteria.value).pipe(catchError(() => observableOf(null)));
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          // this.isLoadingResults = false;
          if (data === null) {
            return [];
          }

          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.
          this.resultsLength = data.user_count;
          return data.data;
        }),
      )
      .subscribe(data => (this.dataSource = data));
  }

  public applySearch = async () => {
    this.userService.getAll(this.searchCriteria.value).subscribe({
      next: this.handleSearchResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

  public handleSearchResponse(data:any){
    if(data == null){
      this.dataSource.data = [];
      this.resultsLength = 0;
      this.ngAfterViewInit();
    } else {
      this.dataSource.data = data.data;
      this.resultsLength = data.user_count;
      this.ngAfterViewInit();
    }
  }

  public handleErrorResponse(error:any){
    this.snackBar.open(error.message, 'dismiss',{
      duration: 3000
    });
  }

  public clearSearch(){
    this.searchCriteria.controls.searchTerm.patchValue('');
    this.searchCriteria.controls.sort.patchValue('userID');
    this.searchCriteria.controls.pagination.patchValue('true');
    this.searchCriteria.controls.direction.patchValue('asc');
    this.searchCriteria.controls.limit.patchValue(5);
    this.searchCriteria.controls.page.patchValue(0);
    this.userService.getAll(this.searchCriteria.value).subscribe({
      next: this.handleSearchResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

  public editUser(element: any){
    const dialogRef = this.matDialog.open(AddUserComponent, {
      width: '100%',
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      let userRole = localStorage.getItem('roleID');
      if(userRole !== '1'){
        this.router.navigate(['/home']);
      } else {
        this.ngAfterViewInit();
      }
    });
  }

}

