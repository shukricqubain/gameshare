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
import { PopUpComponent } from 'src/app/pop-up/pop-up.component';

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
  gameData: Game[];
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
          if (data === null) {
            return [];
          }
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
    let formattedDate = this.dateFunction.formatDateMMDDYYYY(date);
    return formattedDate;
  }

  public editGame(element: any) {
    const dialogRefEdit = this.matDialog.open(AddGameComponent, {
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

  public addGame() {
    const dialogRefAdd = this.matDialog.open(AddGameComponent, {
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

  public deleteGame(element: any){
    const dialogRefDelete = this.matDialog.open(PopUpComponent, {
      width: '100%',
      disableClose: true,
      data: {
        element,
        model: 'game'
      }
    });

    dialogRefDelete.afterClosed().subscribe(result => {
      if(result.event === 'delete'){
        this.gameService.delete(element.gameID).subscribe({
          next: this.handleDeleteResponse.bind(this),
          error: this.handleErrorResponse.bind(this)
        });
        this.snackBar.open(`${element.gameName} has been deleted.`, 'dismiss',{
          duration: 3000
        });
      } else {
        this.snackBar.open(`${element.gameName} has not been deleted.`, 'dismiss',{
          duration: 3000
        });
      }
    });
  }
}

