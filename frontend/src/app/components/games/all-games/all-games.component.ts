import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { Game } from 'src/app/models/game.model';
import { GameService } from 'src/app/services/game.service';
import { MatDialog } from '@angular/material/dialog';
import { AddGameComponent } from '../add-game/add-game.component';
import { DateFunctionsService } from 'src/app/services/dateFunctions.service';
import { PopUpComponent } from '../../reusable/pop-up/pop-up.component';
import { GameInfoComponent } from '../game-info/game-info.component';
import { FilterFormPopUpComponent } from '../../filter-form-pop-up/filter-form-pop-up.component';

@Component({
  selector: 'app-all-games',
  templateUrl: './all-games.component.html',
  styleUrls: ['./all-games.component.css']
})
export class AllGamesComponent {

  constructor(
    private gameService: GameService,
    private snackBar: MatSnackBar,
    private matDialog: MatDialog,
    private dateFunction: DateFunctionsService
  ) { }

  gameData: any;
  search: any;
  pageSize = 5;
  pageIndex = 0;
  resultsLength = 0;
  isLoadingGames: boolean = true;

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

  async ngOnInit() {
    await this.loadGames();
  }

  async loadGames() {
    this.gameService.getAll(this.searchCriteria.value).subscribe({
      next: this.handleSearchResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

  public handleSearchResponse(data: any) {
    if (data == null) {
      this.gameData = [];
      this.resultsLength = 0;
    } else {
      this.gameData = data.data;
      this.resultsLength = data.gameCount;
    }
    this.isLoadingGames = false;
  }

  public handleErrorResponse(error: any) {
    this.snackBar.open(error.message, 'dismiss', {
      duration: 3000
    });
    this.isLoadingGames = false;
  }

  public handleDeleteResponse(data: any) {
    if (data !== null) {
      this.loadGames();
    }
  }

  public applySearch = async () => {
    this.isLoadingGames = true;
    this.gameService.getAll(this.searchCriteria.value).subscribe({
      next: this.handleSearchResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

  public clearSearch() {
    this.isLoadingGames = true;
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

    dialogRefEdit.afterClosed().subscribe(async result => {
      await this.loadGames();
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

    dialogRefAdd.afterClosed().subscribe(async result => {
      await this.loadGames();
    });
  }

  public deleteGame(element: any) {
    const dialogRefDelete = this.matDialog.open(PopUpComponent, {
      width: '100%',
      disableClose: true,
      data: {
        element,
        model: 'game'
      }
    });

    dialogRefDelete.afterClosed().subscribe(result => {
      if (result.event === 'delete') {
        this.gameService.delete(element.gameID).subscribe({
          next: this.handleDeleteResponse.bind(this),
          error: this.handleErrorResponse.bind(this)
        });
        this.snackBar.open(`${element.gameName} has been deleted.`, 'dismiss', {
          duration: 3000
        });
      } else {
        this.snackBar.open(`${element.gameName} has not been deleted.`, 'dismiss', {
          duration: 3000
        });
      }
    });
  }

  gameInfoPopup(game: Game) {
    const dialogRefAdd = this.matDialog.open(GameInfoComponent, {
      disableClose: false,
      height: '80vh',
      data: {
        game
      }
    });

    dialogRefAdd.afterClosed().subscribe(result => {
    });
  }

  filterForm() {
    const dialogRefAdd = this.matDialog.open(FilterFormPopUpComponent, {
      disableClose: false,
      height: '80vh',
      data: {
        model: 'Game',
        form: this.searchCriteria.value
      }
    });

    dialogRefAdd.afterClosed().subscribe(result => {
      
      ///if form was submitted we check if the search criteria are different and apply a search
      if (result != undefined && result.event != undefined && result.event != null && result.event === 'Filter Adjusted') {
        let currentSearch = JSON.stringify(this.searchCriteria.value);
        let newSearch = JSON.stringify(result.data.value);
        if(currentSearch !== newSearch){
          this.searchCriteria = result.data;
          this.applySearch();
        }
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.searchCriteria.controls.page.patchValue(this.pageIndex);
    this.searchCriteria.controls.limit.patchValue(this.pageSize);
    this.isLoadingGames = true;
    this.loadGames();
  }

}


