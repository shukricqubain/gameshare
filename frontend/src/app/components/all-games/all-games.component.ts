import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, map, merge, startWith, switchMap, of as observableOf } from 'rxjs';
import { Game } from 'src/app/models/game.model';
import { GameService } from 'src/app/services/game.service';
import { MatDialog } from '@angular/material/dialog';
import { AddGameComponent } from '../add-game/add-game.component';
import { Router } from '@angular/router';
import { DateFunctionsService } from 'src/app/services/dateFunctions.service';
import swal from 'sweetalert2'

@Component({
  selector: 'app-all-games',
  templateUrl: './all-games.component.html',
  styleUrls: ['./all-games.component.css']
})
export class AllGamesComponent {

  constructor(
    private gameService: GameService,
    private changeDetectorRef: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private matDialog: MatDialog,
    private router: Router,
    private dateFunction: DateFunctionsService
  ) { }

  ngOnInit() {

  }

  displayedColumns: string[] = ['gameID', 'gameName', 'developers', 'publishers', 'genre', 'releaseDate', 'platform', 'actions'];
  dataSource = new MatTableDataSource<any>;
  userData: Game[];
  search: any;
  pageSize = 5;
  currentPage = 0;
  resultsLength = 0;
  isLoadingResults: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  searchCriteria = new FormGroup({
    searchTerm: new FormControl(''),
    sort: new FormControl('gameID', [Validators.required]),
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
          this.searchCriteria.controls.sort.patchValue(this.sort.active);
          this.searchCriteria.controls.direction.patchValue(this.sort.direction);
          this.searchCriteria.controls.page.patchValue(this.paginator.pageIndex);
          this.searchCriteria.controls.limit.patchValue(this.paginator.pageSize);
          return this.gameService!.getAll(this.searchCriteria.value).pipe(catchError(() => observableOf(null)));
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
          this.resultsLength = data.gameCount;
          return data.data;
        }),
      )
      .subscribe(data => (this.dataSource = data));
  }

  public handleSearchResponse(data: any) {
    if (data == null) {
      this.dataSource.data = [];
      this.resultsLength = 0;
      this.ngAfterViewInit();
    } else {
      this.dataSource.data = data.data;
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

  public applySearch = async () => {
    this.gameService.getAll(this.searchCriteria.value).subscribe({
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
    this.gameService.getAll(this.searchCriteria.value).subscribe({
      next: this.handleSearchResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

  public formatDate(date: any) {
    let formattedDate = this.dateFunction.formatDate(date);
    return formattedDate;
  }

  public editGame(element: any) {
    const dialogRef = this.matDialog.open(AddGameComponent, {
      width: '100%',
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.ngAfterViewInit();
      } else {
        this.ngAfterViewInit();
      }
    });
  }

  public deleteGame(element: any){
    swal.fire({
      title: `Are you sure want to delete the game ${element.gameName}?`,
      text: 'You will not be able to recover this game!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.gameService.delete(element.gameID).subscribe({
          next: this.handleDeleteResponse.bind(this),
          error: this.handleErrorResponse.bind(this)
        });
        swal.fire(
          'Deleted!',
          `${element.gameName} has been deleted.`,
          'success'
        )
      } else if (result.dismiss === swal.DismissReason.cancel) {
        swal.fire(
          'Cancelled',
          `${element.gameName} has not been deleted.`,
          'error'
        )
      }
    })
  }
}


