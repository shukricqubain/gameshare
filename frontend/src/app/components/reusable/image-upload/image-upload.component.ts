import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FileNameService } from 'src/app/services/filename.service';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent {

  constructor(
    private fileNameService: FileNameService
  ) {
  }

  fileName: string;
  @Output() loadImageEvent = new EventEmitter<string>();
  unsubscribe$: Subject<boolean> = new Subject();


  ngOnInit(){
    this.fileNameService.getFileNameObs()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(fileName => this.fileName = fileName);
  }

  async onFileSelected(event: any){
    const file = event.target.files[0] ?? null;
    this.fileName = file.name;
    let reader = new FileReader();
    reader.onloadend = function() {
    }
    
    if(file){
      let imgCompressed = await this.compressImage(file, 50);
      imgCompressed = 'data:image/png;base64,' + imgCompressed.split(',')[1];
      this.loadImageEvent.emit(imgCompressed);
    }
  }

  async compressImage(blobImg: any, percent: any){
    let bitmap = await createImageBitmap(blobImg);
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext('2d');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    ctx?.drawImage(bitmap, 0, 0);
    let dataURL = canvas.toDataURL("images/png", percent / 100);
    return dataURL;
  }
}
