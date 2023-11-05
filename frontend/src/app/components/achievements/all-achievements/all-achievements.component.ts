import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { catchError, map, merge, startWith, switchMap, of as observableOf } from 'rxjs';
import { Achievement } from 'src/app/models/achievement.model';
import { AchievementService } from 'src/app/services/achievement.service';
import { AddAchievementComponent } from '../add-achievement/add-achievement.component';
import { PopUpComponent } from 'src/app/pop-up/pop-up.component';

@Component({
  selector: 'app-all-achievements',
  templateUrl: './all-achievements.component.html',
  styleUrls: ['./all-achievements.component.css']
})
export class AllAchievementsComponent {

  constructor(
    private achievementService: AchievementService,
    private snackBar: MatSnackBar,
    private matDialog: MatDialog
  ){
  }

  ngOnInit(){
  }

  displayedColumns: string[] = ['achievementID', 'gameName', 'achievementName', 'achievementDescription', 'achievementIcon', 'actions'];
  dataSource = new MatTableDataSource<any>;
  userData: Achievement[];
  search: any;
  pageSize = 5;
  currentPage = 0;
  resultsLength = 0;
  isLoadingResults: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  searchCriteria = new FormGroup({
    searchTerm: new FormControl(''),
    sort: new FormControl('achievementID', [Validators.required]),
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
          return this.achievementService!.getAll(this.searchCriteria.value).pipe(catchError(() => observableOf(null)));
        }),
        map(data => {
          if (data === null) {
            return [];
          }
          this.resultsLength = data.achievementCount;
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
    this.achievementService.getAll(this.searchCriteria.value).subscribe({
      next: this.handleSearchResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

  public clearSearch() {
    this.searchCriteria.controls.searchTerm.patchValue('');
    this.searchCriteria.controls.sort.patchValue('achievementID');
    this.searchCriteria.controls.pagination.patchValue('true');
    this.searchCriteria.controls.direction.patchValue('asc');
    this.searchCriteria.controls.limit.patchValue(5);
    this.searchCriteria.controls.page.patchValue(0);
    this.achievementService.getAll(this.searchCriteria.value).subscribe({
      next: this.handleSearchResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

  public editAchievement(element: any) {
    const dialogRef = this.matDialog.open(AddAchievementComponent, {
      width: '100%',
      disableClose: true,
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

  public addAchievement(){
    const dialogRef = this.matDialog.open(AddAchievementComponent, {
      width: '100%',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.ngAfterViewInit();
      } else {
        this.ngAfterViewInit();
      }
    });
  }

  public deleteAchievement(element: any){
    const dialogRef = this.matDialog.open(PopUpComponent, {
      width: '100%',
      disableClose: true,
      data: {
        element,
        model: 'achievement'
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if(result.event === 'delete'){
        this.achievementService.delete(element.achievementID).subscribe({
          next: this.handleDeleteResponse.bind(this),
          error: this.handleErrorResponse.bind(this)
        });
        this.snackBar.open(`${element.achievementName} has been deleted.`, 'dismiss',{
          duration: 3000
        });
      } else {
        this.snackBar.open(`${element.achievementName} has not been deleted.`, 'dismiss',{
          duration: 3000
        });
      }
    });
  }

}
