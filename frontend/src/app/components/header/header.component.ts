import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { jwtDecode } from "jwt-decode";
import { ProfilePictureService } from 'src/app/services/profilePicture.service';
import { RoleService } from 'src/app/services/roleID.service';
import { UsernameService } from 'src/app/services/username.service';
import { UserService } from 'src/app/services/user.service';


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
    private profilePictureService: ProfilePictureService
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
    let token = localStorage.getItem('token');
    if(token != null){
      let decoded: any = jwtDecode(token);
      this.userName = decoded.userName;
      this.roleID = decoded.roleID;
      this.profilePictureFileName = decoded.profilePictureFileName;
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
    localStorage.removeItem("token");
    this.profilePictureFileName = '';
    this.router.navigate(['/login']);
  }

}
