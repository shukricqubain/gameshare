import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Achievement } from 'src/app/models/achievement.model';
import { AchievementService } from 'src/app/services/achievement.service';
import { AddAchievementComponent } from '../add-achievement/add-achievement.component';
import { PopUpComponent } from 'src/app/components/pop-up/pop-up.component';

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

  achievementData: any;
  isLoadingAchievements: boolean = true;

  searchCriteria = new FormGroup({
    searchTerm: new FormControl(''),
    sort: new FormControl('achievementID', [Validators.required]),
    pagination: new FormControl('false', [Validators.required]),
    direction: new FormControl('asc', [Validators.required]),
    limit: new FormControl(5, [Validators.required]),
    page: new FormControl(0, [Validators.required])
  });

  async ngOnInit(){
    await this.loadAllAchievements();
  }

  async loadAllAchievements() {
    this.achievementService.getAll({
      searchTerm: '',
      sort: 'achievementID',
      pagination: 'false',
      direction: 'asc'
    }).subscribe({
      next: this.handleSearchResponse.bind(this),
      error: this.handleErrorResponse.bind(this)
    });
  }

  public handleSearchResponse(data: any) {
    console.log(data)
    if (data == null) {
      this.achievementData = [];
    } else {
      this.achievementData = data.data;
    }
    this.isLoadingAchievements = false;
  }

  public handleErrorResponse(error: any) {
    this.snackBar.open(error.message, 'dismiss', {
      duration: 3000
    });
  }

  public async handleDeleteResponse(data:any){
    if(data != null){
      await this.loadAllAchievements();
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
    this.searchCriteria.controls.pagination.patchValue('false');
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

    dialogRef.afterClosed().subscribe(async result => {
      await this.loadAllAchievements();
    });
  }

  public addAchievement(){
    const dialogRef = this.matDialog.open(AddAchievementComponent, {
      width: '100%',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(async result => {
      await this.loadAllAchievements();
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
