import { Component, Inject, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Game } from 'src/app/models/game.model';

@Component({
  selector: 'app-filter-form-pop-up',
  templateUrl: './filter-form-pop-up.component.html',
  styleUrls: ['./filter-form-pop-up.component.css']
})
export class FilterFormPopUpComponent {

  constructor(
    @Optional() private dialogRef?: MatDialogRef<FilterFormPopUpComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any,
  ) {
  }

  modelType: string = '';
  sortItems: any[] = [];
  filterForm = new FormGroup({
    searchTerm: new FormControl(''),
    sort: new FormControl('', [Validators.required]),
    pagination: new FormControl('true', [Validators.required]),
    direction: new FormControl('asc', [Validators.required]),
    limit: new FormControl(5, [Validators.required]),
    page: new FormControl(0, [Validators.required]),
    userID: new FormControl('')
  });

  ngAfterContentInit() {
    if (this.data != undefined && this.data.model != undefined) {
      this.modelType = this.data.model;
    }
    if (this.data != undefined && this.data.form != undefined) { 
      if(this.data.form.searchTerm != undefined) {
        this.filterForm.controls.searchTerm.patchValue(this.data.form.searchTerm);
      }
      if(this.data.form.sort != undefined) {
        this.filterForm.controls.sort.patchValue(this.data.form.sort);
      }
      if(this.data.form.pagination != undefined) {
        this.filterForm.controls.pagination.patchValue(this.data.form.pagination);
      }
      if(this.data.form.direction != undefined){
        this.filterForm.controls.direction.patchValue(this.data.form.direction);
      }
      if(this.data.form.limit != undefined){
        this.filterForm.controls.limit.patchValue(this.data.form.limit);
      }
      if(this.data.form.page != undefined){
        this.filterForm.controls.page.patchValue(this.data.form.page);
      }
      if(this.data.form.userID != undefined){
        this.filterForm.controls.userID.patchValue(this.data.form.userID);
      }
    }
    switch (this.modelType) {
      case ('Game'):
        this.filterForm.controls.sort.patchValue('gameID');
        this.sortItems = [
          { display: 'Game ID', sql: 'gameID' },
          { display: 'Name', sql: 'gameName' },
          { display: 'Developers', sql: 'developers' },
          { display: 'Publishers', sql: 'publishers' },
          { display: 'Genre', sql: 'genre' },
          { display: 'Release Date', sql: 'releaseDate' },
          { display: 'Platform', sql: 'platform' },
        ];
        break;
      case ('Achievement'):
        this.filterForm.controls.sort.patchValue('achievementID');
        this.sortItems = [
          { display: 'Achievement ID', sql: 'achievementID' },
          { display: 'Game ID', sql: 'gameID'},
          { display: 'Game Name', sql: 'gameName' },
          { display: 'Achievement Name', sql: 'achievementName'},
          { display: 'Achievement Description', sql: 'achievementDescription'}
        ];
        break;
      case ('UserAchievement'):
        this.filterForm.controls.sort.patchValue('userAchievementID');
        this.sortItems = [
          { display: 'User Achievement ID', sql: 'userAchievementID' },
          { display: 'Achievement ID', sql: 'achievementID' },
          { display: 'Game ID', sql: 'gameID'},
          { display: 'Game Name', sql: 'gameName' },
          { display: 'Achievement Name', sql: 'achievementName'},
          { display: 'Achievement Description', sql: 'achievementDescription'},
          { display: 'Achievement Status', sql: 'achievementStatus'}
        ];
        break;
    }
  }

  closeDialog(data?: any) {
    ///check if user submitted form or not
    if (data !== null && data !== undefined && data === 'confirm') {
      if(typeof this.filterForm.controls.limit.value === 'string'){
        this.filterForm.controls.limit.patchValue(parseInt(this.filterForm.controls.limit.value));
      }
      this.dialogRef?.close({ event: 'Filter Adjusted', data: this.filterForm });
    } else {
      this.dialogRef?.close({ event: 'Cancel' });
    }
  }

  clearSearch(){
    this.filterForm.controls.searchTerm.patchValue('');
  }
}
