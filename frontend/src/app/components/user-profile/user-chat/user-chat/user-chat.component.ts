import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateFunctionsService } from 'src/app/services/dateFunctions.service';
import { UserChat } from 'src/app/models/userChat.model';
import { UserChatService } from 'src/app/services/userChat.service';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-chat',
  templateUrl: './user-chat.component.html',
  styleUrls: ['./user-chat.component.css']
})
export class UserChatComponent {

  @Input() userChat: UserChat;
  @Input() currentUser: User;
  @Output() loadChatEvent = new EventEmitter<string>();

  constructor(
    private snackBar: MatSnackBar,
    private userChatService: UserChatService,
    private router: Router,
    private dateFunction: DateFunctionsService
  ){}

  otherUser: String = '';

  ngOnInit(){
    this.prepareUserChat();
  }

  prepareUserChat(){
    if(this.userChat.userOneID == this.currentUser.userID){
      this.otherUser = this.userChat["userTwo.userName"] ? this.userChat["userTwo.userName"]: '';
    } else {
      this.otherUser = this.userChat["userOne.userName"] ? this.userChat["userOne.userName"]: '';
    }
  }

  openMessages(){
    this.router.navigate([`/user-message/${this.userChat.userChatID}`], { state: { userChat: this.userChat } });
  }

}
