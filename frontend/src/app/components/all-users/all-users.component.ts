import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup} from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule} from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {catchError, map, merge, Observable, of as observableOf, startWith, switchMap} from 'rxjs';

import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})
export class AllUsersComponent implements AfterViewInit {

  displayedColumns: string[] = ['userID', 'userName', 'userRole', 'email'];
  dataSource = new MatTableDataSource<any>;
  userData: User[];
  search: any;
  pageSize = 5;
  currentPage = 0;
  resultsLength = 0;
  isLoadingResults: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private userService: UserService,
  ){
  }

  async ngOnInit(){
  }

  async ngAfterViewInit() {
    //await this.loadUsers();
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          let searchCriteria = {
            searchTerm: '',
            sort: this.sort.active,
            pagination: 'true',
            direction: this.sort.direction,
            limit: this.pageSize,
            page: this.paginator.pageIndex
          }
          return this.userService!.getAll(searchCriteria).pipe(catchError(() => observableOf(null)));
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
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

  public applyFilter = ($event: Event) => {
    const filterValue = ($event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}

