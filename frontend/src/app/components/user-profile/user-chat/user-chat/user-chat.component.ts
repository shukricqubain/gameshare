import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateFunctionsService } from 'src/app/services/dateFunctions.service';
import { UserChat } from 'src/app/models/userChat.model';
import { UserChatService } from 'src/app/services/userChat.service';

@Component({
  selector: 'app-user-chat',
  templateUrl: './user-chat.component.html',
  styleUrls: ['./user-chat.component.css']
})
export class UserChatComponent {

  @Input() userChat: UserChat;
  @Output() loadChatEvent = new EventEmitter<string>();

  constructor(
    private snackBar: MatSnackBar,
    private userChatService: UserChatService,
    private dateFunction: DateFunctionsService
  ){}

  ngOnInit(){}

}
