import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserMessage } from 'src/app/models/userMessage.model';
import { DateFunctionsService } from 'src/app/services/dateFunctions.service';
import { UserMessageService } from 'src/app/services/userMessage.service';

@Component({
  selector: 'app-user-message',
  templateUrl: './user-message.component.html',
  styleUrls: ['./user-message.component.css']
})
export class UserMessageComponent {

  @Input() userMessage: UserMessage;
  @Output() loadMessageEvent = new EventEmitter<string>();

  constructor(
    private snackBar: MatSnackBar,
    private userMessageService: UserMessageService,
    private dateFunction: DateFunctionsService
  ){}

  ngOnInit(){}

}
