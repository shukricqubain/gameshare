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
  title = 'Gameshare';
  hideHeader: boolean = true;

  constructor (
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
  }

  async ngOnInit(){
    ///grab token from localstorage
    let token = localStorage.getItem('token');
    ///see if token is expired
    if(token){
      await this.userService.checkLoggedIn({token:token}).subscribe({
        next: this.handleLoginResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    } else {
      localStorage.removeItem("token"); 
      this.router.navigate(['/login']);
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
      localStorage.setItem('token', data.token);
    ///if token expired, remove token from local storage reload login
    } else if(data.message === 'Token deleted, reload login.') {
      localStorage.removeItem("token"); 
      this.router.navigate(['/login']);
      this.snackBar.open('Token expired. Please login again.', 'dismiss', {
        duration: 3000
      });
    }
  }

  handleErrorResponse(error: any) {
    console.log(error)
    localStorage.removeItem("token");
    this.router.navigate(['/login']);
    this.snackBar.open(error.error.message, 'dismiss', {
      duration: 3000
    });
  }
}
