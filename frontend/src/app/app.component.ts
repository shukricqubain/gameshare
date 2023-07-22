import { Component, NgZone } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular_demo';
  login: boolean = true;

  constructor (private zone: NgZone, private router: Router) {
  }

  ngOnInit(){
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
}
