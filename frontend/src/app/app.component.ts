import { Component} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { UserService } from './services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { RoleService } from './services/roleID.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Gameshare';
  hideHeader: boolean = true;

  constructor (
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
  }

  async ngOnInit(){
    /// check if userName and roleID is in local storage
    let localUserName = localStorage.getItem('userName');
    let localRoleID = localStorage.getItem('roleID');
    ///see if token is expired
    if(localUserName !== null && localRoleID !== null){
      let data = {
        userName: localUserName,
        roleID: localRoleID
      }
      await this.userService.checkLoggedIn(data).subscribe({
        next: this.handleLoginResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    }

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/login' || event.url === '/' || event.url === '/signup') {
          this.hideHeader = true;
        } else {
          this.hideHeader = false;
        }
      }
    });
  }

  handleLoginResponse(data: any) {
    if (data.message === 'Logged in successfully.') {
      this.snackBar.open(data.message, 'dismiss', {
        duration: 3000
      });
      localStorage.setItem('userName', data.userName);
      localStorage.setItem('roleID', data.roleID);
      this.router.navigate(['/home']);
    ///if token expired, remove role and username from local storage reload login
    } else if(data.message === 'Token deleted, reload login.') {
      localStorage.removeItem("userName"); 
      localStorage.removeItem("roleID");
      this.router.navigate(['/login']);
      this.snackBar.open('Token expired. Please login again.', 'dismiss', {
        duration: 3000
      });
    ///if no token exists on db reroute to login page
    } else {
      localStorage.removeItem("userName"); 
      localStorage.removeItem("roleID");
      this.router.navigate(['/login']);
    }
  }

  handleErrorResponse(error: any) {
    if (error.error.message !== undefined) {
      this.snackBar.open(error.error.message, 'dismiss', {
        duration: 3000
      });
    } else {
      this.snackBar.open(error.message, 'dismiss', {
        duration: 3000
      });
    }
  }
}
