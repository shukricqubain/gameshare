import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { startWith, switchMap, merge, catchError, map, of as observableOf } from 'rxjs';
import { Thread } from 'src/app/models/thread.model';
import { DateFunctionsService } from 'src/app/services/dateFunctions.service';
import { ThreadService } from 'src/app/services/thread.service';
import { AddThreadComponent } from '../add-thread/add-thread.component';
import { PopUpComponent } from 'src/app/components/reusable/pop-up/pop-up.component';

@Component({
  selector: 'app-all-threads',
  templateUrl: './all-threads.component.html',
  styleUrls: ['./all-threads.component.css']
})
export class AllThreadsComponent {
  constructor(
    private threadService: ThreadService,
    private changeDetectorRef: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private matDialog: MatDialog,
    private router: Router,
    private dateFunction: DateFunctionsService
  ) { }

  ngOnInit() {
  }

  displayedBoardColumns: string[] = ['threadID', 'boardID', 'boardName', 'threadName', 'createdAt', 'updatedAt', 'actions'];
  threadDataSource = new MatTableDataSource<any>;
  threadData: Thread[];
  search: any;
  pageSize = 5;
  currentPage = 0;
  resultsLength = 0;
  isLoadingResults: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  threadSearchCriteria = new FormGroup({
    searchTerm: new FormControl(''),
    sort: new FormControl('threadID', [Validators.required]),
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
          this.threadSearchCriteria.controls.sort.patchValue(this.sort.active);
          this.threadSearchCriteria.controls.direction.patchValue(this.sort.direction);
          this.threadSearchCriteria.controls.page.patchValue(this.paginator.pageIndex);
          this.threadSearchCriteria.controls.limit.patchValue(this.paginator.pageSize);
          return this.threadService!.getAll(this.threadSearchCriteria.value).pipe(catchError(() => observableOf(null)));
        }),
        map(data => {
          if (data === null) {
            return [];
          }
          this.resultsLength = data.threadCount;
          return data.data;
        }),
      )
      .subscribe(data => (this.threadDataSource = data));
  }

  public handleSearchResponse(data: any) {
    if (data == null) {
      this.threadDataSource.data = [];
      this.resultsLength = 0;
      this.ngAfterViewInit();
    } else {
      this.threadDataSource.data = data.data;
      this.resultsLength = data.boardCount;
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

  public applyThreadSearch = async () => {
    this.threadService.getAll(this.threadSearchCriteria.value).subscribe({
      next: this.handleSearchResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

  public clearThreadSearch() {
    this.threadSearchCriteria.controls.searchTerm.patchValue('');
    this.threadSearchCriteria.controls.sort.patchValue('threadID');
    this.threadSearchCriteria.controls.pagination.patchValue('true');
    this.threadSearchCriteria.controls.direction.patchValue('asc');
    this.threadSearchCriteria.controls.limit.patchValue(5);
    this.threadSearchCriteria.controls.page.patchValue(0);
    this.threadService.getAll(this.threadSearchCriteria.value).subscribe({
      next: this.handleSearchResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

  public formatDate(date: any) {
    let formattedDate = this.dateFunction.formatDateMMDDYYYY(date);
    return formattedDate;
  }

  public editThread(element: any) {
    const dialogRefEdit = this.matDialog.open(AddThreadComponent, {
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

  public addThread() {
    const dialogRefAdd = this.matDialog.open(AddThreadComponent, {
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

  public deleteThread(element: any){
    const dialogRefDelete = this.matDialog.open(PopUpComponent, {
      width: '100%',
      disableClose: true,
      data: {
        element,
        model: 'thread'
      }
    });

    dialogRefDelete.afterClosed().subscribe(result => {
      if(result.event === 'delete'){
        this.threadService.delete(element.threadID).subscribe({
          next: this.handleDeleteResponse.bind(this),
          error: this.handleErrorResponse.bind(this)
        });
        this.snackBar.open(`${element.threadName} has been deleted.`, 'dismiss',{
          duration: 3000
        });
      } else {
        this.snackBar.open(`${element.threadName} has not been deleted.`, 'dismiss',{
          duration: 3000
        });
      }
    });
  }
}

