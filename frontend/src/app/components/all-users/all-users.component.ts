import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})
export class AllUsersComponent {

  displayedColumns = ['userID', 'username', 'userRole'];
  dataSource = new MatTableDataSource<User>();

  @ViewChild(MatPaginator) paginator:any = MatPaginator;
  @ViewChild(MatSort, {static: false}) sort = new MatSort();

  constructor(
    private userService: UserService,
  ){
  }

  async ngOnInit(){
    await this.userService.getAll().subscribe(res => {
      this.dataSource.data = res;
    });
    console.log(this.dataSource);

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}

