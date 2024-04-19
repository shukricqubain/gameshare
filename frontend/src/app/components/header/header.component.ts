import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject, lastValueFrom, takeUntil } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { ProfilePictureService } from 'src/app/services/profilePicture.service';
import { RoleService } from 'src/app/services/roleID.service';

import { UserService } from 'src/app/services/user.service';
import { UsernameService } from 'src/app/services/username.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(
    private userService: UserService,
    private router: Router,
    private usernameService: UsernameService,
    private roleService: RoleService,
    private profilePictureService: ProfilePictureService,
    private snackBar: MatSnackBar
  ){
  }

  unsubscribe$: Subject<boolean> = new Subject();
  userName: string = '';
  roleID: number = 0;
  profilePictureFileName: string;

  async ngOnInit(){
    this.usernameService.getUsernameObs()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(username => this.userName = username);
    this.roleService.getRoleObs()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(roleID => this.roleID = Number(roleID));
    this.profilePictureService.getProfilePictureObs()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(profilePictureFileName => this.profilePictureFileName = profilePictureFileName);
    let localUserName = localStorage.getItem('userName');
    let localRoleID = localStorage.getItem('roleID');
    let localProfilePictureFileName = localStorage.getItem('profilePictureFileName');
    if(localUserName != null && localRoleID != null && localProfilePictureFileName != null){
      this.userName = localUserName;
      this.roleID = Number(localRoleID);
      this.profilePictureFileName = localProfilePictureFileName; 
    }
  }

  ngOnDestroy(){
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  async viewProfile(){
    if(this.userName !== null || this.userName === ''){
      await this.userService.getUserByName(this.userName).subscribe(user => {
        this.router.navigate([`/user-profile/${user.userID}`], { state: {userID: user.userID}});
      });
    }
  }

  logout(){
    localStorage.removeItem("userName");
    localStorage.removeItem('roleID');
    localStorage.removeItem('profilePictureFileName');
    this.profilePictureFileName = '';
    this.router.navigate(['/login']);
  }

}
