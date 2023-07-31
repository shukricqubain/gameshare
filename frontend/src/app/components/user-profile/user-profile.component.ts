import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {

  constructor(private location: Location){
  }

  ngOnInit(){
    let user = this.location.getState();
  }
}
