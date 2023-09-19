import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.css']
})
export class PopUpComponent {


  constructor(
    @Optional() private dialogRef?: MatDialogRef<PopUpComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }

  ngAfterViewInit() {
    console.log('in on init');
    console.log(this.data)
    if (this.data !== null && this.data !== undefined) {
      console.log(this.data)

      switch (this.data.model) {
        case ('user'):
          break;
        case ('game'):
          break;
        case ('achievement'):
          break;
        case ('userGame'):
          break;
      }
    }

  }

  onSubmit() {
    this.dialogRef?.close({
      event: 'delete'
    });
  }

  closeDialog() {
    this.dialogRef?.close({ event: 'Cancel' });
  }

}
