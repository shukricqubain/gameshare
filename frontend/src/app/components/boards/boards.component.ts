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

  allBoards: Board[];
  search: any;
  pageSize = 5;
  currentPage = 0;
  resultsLength = 0;
  isLoadingResults: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  async ngOnInit() {
    await this.loadAllBoards();
  }

  async loadAllBoards($event?: any) {
    this.isLoadingResults = true;
    console.log($event)
    let searchCritera = {
    }
    if ($event !== undefined) {
      this.pageSize = $event.pageSize,
        this.currentPage = $event.pageIndex
    }
    searchCritera = {
      searchTerm: '',
      sort: 'boardID',
      pagination: 'true',
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
    this.allBoards = data.data;
    this.resultsLength = this.allBoards.length;
    this.isLoadingResults = false;
    console.log(this.allBoards)
  }

  handleErrorResponse(error: any) {
    console.log(error);
    this.snackBar.open(`Error ${error} loading Boards.`, 'dismiss', {
      duration: 3000
    });
    this.isLoadingResults = false;
  }
}
