import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup} from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule} from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

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
  public pageSize = 5;
  public currentPage = 0;
  public totalSize = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private userService: UserService,
  ){
  }

  async ngOnInit(){
    this.search = {
      searchTerm: '',
      sort: 'userID',
      sortDirection: 'asc',
      pagination: 'true',
      limit: this.pageSize,
      page: this.currentPage,
    };
    await this.userService.getAll(this.search).subscribe(res => {
      this.userData = res.all_users;
      this.totalSize = res.user_count;
      this.dataSource.data = this.userData;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

  }

  public async handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.search = {
      searchTerm: '',
      sort: 'userID',
      sortDirection: 'asc',
      pagination: 'true',
      limit: this.pageSize,
      page: this.currentPage,
    }
    await this.userService.getAll(this.search).subscribe(res => {
      this.userData = res.all_users;
      this.dataSource.data = this.userData;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public applyFilter = ($event: Event) => {
    const filterValue = ($event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}

