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

  ngOnInit(){
  }

  async viewProfile(){
    let userName = localStorage.getItem('userName');
    if(userName !== null){
      await this.userService.getUserByName(userName).subscribe(user => {
        this.router.navigate([`/user-profile/${user.userID}`], { state: {user: user}});
      });
    }
  }

}
