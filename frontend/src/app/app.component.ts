import { Component} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { UserService } from './services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular_demo';
  login: boolean = true;

  constructor (
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar,) {
  }

  ngOnInit(){

    /// check if userName is in local storage
    let logged_user = localStorage.getItem('userName');
    ///see if token is expired
    if(logged_user !== null){
      let data = {
        userName: logged_user
      }
      this.userService.checkLoggedIn(data).subscribe({
        next: this.handleLoginResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    }

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/login' || event.url === '/') {
          this.login= true;
        } else {
          this.login= false;
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
      this.router.navigate(['/home']);
    ///if no token exists on db reroute to login page
    } else {
      localStorage.removeItem("userName"); 
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
