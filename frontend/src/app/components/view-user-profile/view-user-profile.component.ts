import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service';
import { Location } from '@angular/common';
import { User } from 'src/app/models/user.model';
import { lastValueFrom } from 'rxjs';
import { DateFunctionsService } from 'src/app/services/dateFunctions.service';

@Component({
  selector: 'app-view-user-profile',
  templateUrl: './view-user-profile.component.html',
  styleUrls: ['./view-user-profile.component.css']
})
export class ViewUserProfileComponent {

  constructor(
    private location: Location,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private dateFunction: DateFunctionsService
  ){}

  userLoaded: boolean = false;
  user: User;

  async ngAfterViewInit(){
    let data: any = this.location.getState();
    await this.loadUserToView(data);
  }

  async loadUserToView(data: any){
    try {
      if(!this.userLoaded){
        let result = await lastValueFrom(this.userService.get(data.userID).pipe());
        console.log(result)
        if(result != undefined){
          this.user = result;
          this.userLoaded = true;
        } else {
          this.userLoaded = true;
          this.snackBar.open('User details return undefined.', 'dismiss', {
            duration: 2000
          });
        }
      }
    } catch(err){
      console.error(err);
      this.userLoaded = true;
      this.snackBar.open('Error loading user details.', 'dismiss', {
        duration: 2000
      });
    }
  }

  public formatDate(date: any) {
    let formattedDate = this.dateFunction.formatDateMMDDYYYY(date);
    return formattedDate;
  }

}
