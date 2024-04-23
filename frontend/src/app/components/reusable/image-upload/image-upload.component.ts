import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { FileNameService } from 'src/app/services/filename.service';
import { ThreadItemService } from 'src/app/services/threadItem.service';
import { UserMessageService } from 'src/app/services/userMessage.service';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent {

  constructor(
    private fileNameService: FileNameService,
    private threadItemService: ThreadItemService,
    private userMessageService: UserMessageService,
    private snackBar: MatSnackBar,
  ) {
  }

  fileName: string;
  @Input() assetLocation: string;
  @Output() loadImageEvent = new EventEmitter<string>();
  unsubscribe$: Subject<boolean> = new Subject();
  threadItemSuccessMessage: string = 'Successfully uploaded an image in a thread.';
  threadItemErrorMessage: string = 'An error occurred while uploading an image in a thread.';
  userMessageSuccessMessage: string = 'Successfully uploaded an image in a user message.';
  userMessageErrorMessage: string = 'An error occurred while uploading an image in a user message.';

  ngOnInit() {
    this.fileNameService.getFileNameObs()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(fileName => this.fileName = fileName);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      if(file.name.includes('(') || file.name.includes(')')){
        this.snackBar.open(`File name cannot include these characters:'(,)'`, 'dismiss', {
          duration: 3000
        });
      } else {
        this.fileName = file.name.toLowerCase();
        const formData = new FormData();
        formData.append("fileName", file.name);
        formData.append("imageFile", file);
        switch (this.assetLocation) {
          case 'thread-items':
            this.threadItemService.uploadThreadItemImage(this.assetLocation, formData).subscribe({
              next: this.handleUploadResponse.bind(this),
              error: this.handleErrorResponse.bind(this)
            });
            break;
          case 'user-messages':
            this.userMessageService.uploadUserMessageImage(this.assetLocation, formData).subscribe({
              next: this.handleUploadResponse.bind(this),
              error: this.handleErrorResponse.bind(this)
            });
            break;
        }
        let assetPathFileName = `assets/${this.assetLocation}/${this.fileName}`;
        this.loadImageEvent.emit(assetPathFileName);
      }
    }
  }

  handleErrorResponse(error: any) {
    console.error(error);
    if(error.message === 'File too large'){
      this.snackBar.open('Image uploaded is too large. Please, upload a smaller version.', 'dismiss', {
        duration: 3000
      });
    } else {
      switch (this.assetLocation) {
        case 'thread-items':
          this.snackBar.open(this.threadItemErrorMessage, 'dismiss', {
            duration: 3000
          });
          break;
        case 'user-messages':
          this.snackBar.open(this.userMessageErrorMessage, 'dismiss', {
            duration: 3000
          });
          break;
      }
    }
  }

  handleUploadResponse(data: any) {
    if (data) {
      switch (this.assetLocation) {
        case 'thread-items':
          this.snackBar.open(this.threadItemSuccessMessage, 'dismiss', {
            duration: 3000
          });
          break;
        case 'user-messages':
          this.snackBar.open(this.userMessageSuccessMessage, 'dismiss', {
            duration: 3000
          });
          break;
      }
    }
  }
}
