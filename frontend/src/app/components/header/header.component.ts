import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

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
    private usernameService: UsernameService
  ){
  }

  unsubscribe$: Subject<boolean> = new Subject();
  userName: string = '';
  ngOnInit(){
    this.usernameService.getUsernameObs()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(username => this.userName = username);
    console.log(this.userName)
    let data = localStorage.getItem('userName');
    if(data !== null){
      this.userName = data;
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
    this.router.navigate(['/login']);
  }

}
