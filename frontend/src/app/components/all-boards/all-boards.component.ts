import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { startWith, switchMap, merge, catchError, map, of as observableOf } from 'rxjs';
import { Board } from 'src/app/models/board.model';
import { BoardService } from 'src/app/services/board.service';
import { DateFunctionsService } from 'src/app/services/dateFunctions.service';
import { AddBoardComponent } from '../add-board/add-board.component';
import { PopUpComponent } from 'src/app/pop-up/pop-up.component';

@Component({
  selector: 'app-all-boards',
  templateUrl: './all-boards.component.html',
  styleUrls: ['./all-boards.component.css']
})
export class AllBoardsComponent {

  constructor(
    private boardService: BoardService,
    private changeDetectorRef: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private matDialog: MatDialog,
    private router: Router,
    private dateFunction: DateFunctionsService
  ) { }

  ngOnInit() {
  }

  displayedBoardColumns: string[] = ['boardID', 'gameID', 'gameName', 'createdAt', 'updatedAt', 'actions'];
  boardDataSource = new MatTableDataSource<any>;
  boardData: Board[];
  search: any;
  pageSize = 5;
  currentPage = 0;
  resultsLength = 0;
  isLoadingResults: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  boardSearchCriteria = new FormGroup({
    searchTerm: new FormControl(''),
    sort: new FormControl('boardID', [Validators.required]),
    pagination: new FormControl('true', [Validators.required]),
    direction: new FormControl('asc', [Validators.required]),
    limit: new FormControl(5, [Validators.required]),
    page: new FormControl(0, [Validators.required])
  });

  async ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page, this.paginator.pageSize)
      .pipe(
        startWith({}),
        switchMap(() => {
          // this.isLoadingResults = true;
          this.boardSearchCriteria.controls.sort.patchValue(this.sort.active);
          this.boardSearchCriteria.controls.direction.patchValue(this.sort.direction);
          this.boardSearchCriteria.controls.page.patchValue(this.paginator.pageIndex);
          this.boardSearchCriteria.controls.limit.patchValue(this.paginator.pageSize);
          return this.boardService!.getAll(this.boardSearchCriteria.value).pipe(catchError(() => observableOf(null)));
        }),
        map(data => {
          if (data === null) {
            return [];
          }
          this.resultsLength = data.gameCount;
          return data.data;
        }),
      )
      .subscribe(data => (this.boardDataSource = data));
  }

  public handleSearchResponse(data: any) {
    if (data == null) {
      this.boardDataSource.data = [];
      this.resultsLength = 0;
      this.ngAfterViewInit();
    } else {
      this.boardDataSource.data = data.data;
      this.resultsLength = data.user_count;
      this.ngAfterViewInit();
    }
  }

  public handleErrorResponse(error: any) {
    this.snackBar.open(error.message, 'dismiss', {
      duration: 3000
    });
  }

  public handleDeleteResponse(data:any){
    if(data == null){
      this.ngAfterViewInit();
    } else {
      this.ngAfterViewInit();
    }
  }

  public applyBoardSearch = async () => {
    this.boardService.getAll(this.boardSearchCriteria.value).subscribe({
      next: this.handleSearchResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

  public clearBoardSearch() {
    this.boardSearchCriteria.controls.searchTerm.patchValue('');
    this.boardSearchCriteria.controls.sort.patchValue('boardID');
    this.boardSearchCriteria.controls.pagination.patchValue('true');
    this.boardSearchCriteria.controls.direction.patchValue('asc');
    this.boardSearchCriteria.controls.limit.patchValue(5);
    this.boardSearchCriteria.controls.page.patchValue(0);
    this.boardService.getAll(this.boardSearchCriteria.value).subscribe({
      next: this.handleSearchResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

  public formatDate(date: any) {
    let formattedDate = this.dateFunction.formatDateMMDDYYYY(date);
    return formattedDate;
  }

  public editBoard(element: any) {
    const dialogRefEdit = this.matDialog.open(AddBoardComponent, {
      width: '100%',
      disableClose: true,
      data: {
        isEdit: true,
        element
      }
    });

    dialogRefEdit.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.ngAfterViewInit();
      } else {
        this.ngAfterViewInit();
      }
    });
  }

  public addBoard() {
    const dialogRefAdd = this.matDialog.open(AddBoardComponent, {
      width: '100%',
      disableClose: true,
      data: {
        isEdit: false
      }
    });

    dialogRefAdd.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.ngAfterViewInit();
      } else {
        this.ngAfterViewInit();
      }
    });
  }

  public deleteBoard(element: any){
    const dialogRefDelete = this.matDialog.open(PopUpComponent, {
      width: '100%',
      disableClose: true,
      data: {
        element,
        model: 'board'
      }
    });

    dialogRefDelete.afterClosed().subscribe(result => {
      if(result.event === 'delete'){
        this.boardService.delete(element.boardID).subscribe({
          next: this.handleDeleteResponse.bind(this),
          error: this.handleErrorResponse.bind(this)
        });
        this.snackBar.open(`${element.boardName} has been deleted.`, 'dismiss',{
          duration: 3000
        });
      } else {
        this.snackBar.open(`${element.boardName} has not been deleted.`, 'dismiss',{
          duration: 3000
        });
      }
    });
  }
}

