import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Board } from 'src/app/models/board.model';
import { BoardService } from 'src/app/services/board.service';
import { DateFunctionsService } from 'src/app/services/dateFunctions.service';
import { MatCard } from '@angular/material/card';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BoardComponent } from './board/board.component';


@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css']
})
export class BoardsComponent {


  constructor(
    private boardService: BoardService,
    private changeDetectorRef: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private matDialog: MatDialog,
    private router: Router,
    private dateFunction: DateFunctionsService
  ) { }

  search: any;
  pageSize = 100;
  currentPage = 0;
  resultsLength = 0;
  isLoadingResults: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<Board>();

  async ngOnInit() {
    await this.loadAllBoards();
  }

  async loadAllBoards() {
    this.isLoadingResults = true;
    let searchCritera = {
    }
    searchCritera = {
      searchTerm: '',
      sort: 'boardID',
      pagination: 'false',
      direction: 'asc',
      limit: this.pageSize,
      page: this.currentPage
    }
    this.boardService.getAll(searchCritera).subscribe({
      next: this.handleSearchResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

  handleSearchResponse(data: any) {
    this.dataSource.data = data.data;
    this.resultsLength = data.boardCount;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.isLoadingResults = false;
  }

  handleErrorResponse(error: any) {
    console.log(error);
    this.snackBar.open(`Error ${error} loading Boards.`, 'dismiss', {
      duration: 3000
    });
    this.isLoadingResults = false;
  }
  
  openBoard(board: Board){
    this.router.navigate([`/board/${board.boardID}`], {state: {board}});
  }
}
