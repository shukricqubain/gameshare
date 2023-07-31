import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(
    private userService: UserService,
    private router: Router
  ){
  }

  userName: string = '';
  ngOnInit(){
    let data = localStorage.getItem('userName');
    if(data !== null){
      this.userName = data;
    }
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
