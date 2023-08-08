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
  pageSize = 5;
  currentPage = 0;
  totalSize = 0;
  loading: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private userService: UserService,
  ){
  }

  async ngOnInit(){
  }

  async ngAfterViewInit() {
    await this.loadUsers();
  }

  public async loadUsers(obj?: any){
    this.search = {
      searchTerm: '',
      sort: 'userID',
      sortDirection: 'asc',
      pagination: 'true',
      limit: this.pageSize,
      page: this.currentPage,
    };
    await this.userService.getAll(this.search).subscribe(res => {
      this.userData = res.data;
      this.totalSize = res.user_count;
      this.dataSource.data = this.userData;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  public async changePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    await this.loadUsers();
  }

  public applyFilter = ($event: Event) => {
    const filterValue = ($event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}

