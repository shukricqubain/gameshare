import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ghost',
  templateUrl: './ghost.component.html',
  styleUrls: ['./ghost.component.css']
})
export class GhostComponent {

  @Input() type: string;


  constructor(){}

  ngOnInit(){
    console.log(this.type)
  }

}
