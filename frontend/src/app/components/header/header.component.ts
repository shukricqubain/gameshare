import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
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
    private roleService: RoleService
  ){
  }

  unsubscribe$: Subject<boolean> = new Subject();
  userName: string = '';
  roleID: number = 0;

  ngOnInit(){
    this.usernameService.getUsernameObs()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(username => this.userName = username);
    this.roleService.getRoleObs()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(roleID => this.roleID = Number(roleID));
    let localUserName = localStorage.getItem('userName');
    let localRoleID = localStorage.getItem('roleID');
    if(localUserName !== null && localRoleID !== null){
      this.userName = localUserName;
      this.roleID = Number(localRoleID);
    }
  }

  ngOnDestroy(){
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  async viewProfile(){
    if(this.userName !== null || this.userName === ''){
      await this.userService.getUserByName(this.userName).subscribe(user => {
        this.router.navigate([`/user-profile/${user.userID}`], { state: {user: user}});
      });
    }
  }

  logout(){
    localStorage.removeItem("userName");
    localStorage.removeItem('roleID');
    this.router.navigate(['/login']);
  }

}
