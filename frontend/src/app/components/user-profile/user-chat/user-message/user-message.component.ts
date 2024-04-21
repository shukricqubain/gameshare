import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { lastValueFrom } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { DateFunctionsService } from 'src/app/services/dateFunctions.service';
import { UserService } from 'src/app/services/user.service';
import { UserMessageService } from 'src/app/services/userMessage.service';
import { Location } from '@angular/common';
import { UserChat } from 'src/app/models/userChat.model';
import { UserMessage } from 'src/app/models/userMessage.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FileNameService } from 'src/app/services/filename.service';

@Component({
  selector: 'app-user-message',
  templateUrl: './user-message.component.html',
  styleUrls: ['./user-message.component.css']
})
export class UserMessageComponent {

  constructor(
    private snackBar: MatSnackBar,
    private userMessageService: UserMessageService,
    private dateFunction: DateFunctionsService,
    private userService: UserService,
    private location: Location,
    private fileNameService: FileNameService
  ) { }

  userName: any;
  user: User;
  messagesLoaded: boolean = false;
  userChat: UserChat;
  userMessages: UserMessage[] = [];
  otherUser: string;
  otherUserID: number;
  fileName: string;
  isEdit: boolean = false;
  editMessage: UserMessage;
  assetLocation: string = 'user-messages';


  userMessageForm = new FormGroup({
    userChatID: new FormControl(''),
    userMessage: new FormControl(''),
    messageImage: new FormControl('')
  });

  async ngOnInit(){
    let data: any = this.location.getState();
    if(data && data.userChat){
      this.userChat = data.userChat;
      await this.checkCurrentUser();
      await this.loadAllMessages();
      await this.checkReadReceipts();
      this.prepareChat();
    } else {
      this.snackBar.open('Error loading userChat details.', 'dismiss', {
        duration: 2000
      });
    }
  }

  prepareChat(){
    if(this.userChat.userOneID == this.user.userID){
      this.otherUser = this.userChat["userTwo.userName"] ? this.userChat["userTwo.userName"]: '';
      this.otherUserID = this.userChat.userTwoID ? this.userChat.userTwoID : 0;
    } else {
      this.otherUser = this.userChat["userOne.userName"] ? this.userChat["userOne.userName"]: '';
      this.otherUserID = this.userChat.userOneID ? this.userChat.userOneID : 0;
    }
  }

  prepareMessageDate(message: UserMessage){
    if(message.isRead || message.isEdit){
      return this.formatDate(message.updatedAt);
    } else {
      return this.formatDate(message.createdAt);
    }
  }

  async checkCurrentUser() {
    this.userName = localStorage.getItem('userName') ? localStorage.getItem('userName') : '';
    this.user = await lastValueFrom(this.userService.getUserByName(this.userName).pipe());
  }

  async loadAllMessages(){
    try {
      if(!this.messagesLoaded){
        let userChatID = this.userChat.userChatID ? this.userChat.userChatID : 0; 
        if(userChatID == 0){
          this.userMessages = [];
          this.messagesLoaded = true;
          this.snackBar.open('UserChatID was undefined.', 'dismiss', {
            duration: 2000
          });
        } else {
          let result: UserMessage[] = await lastValueFrom(this.userMessageService.getAllByUserChatID(userChatID).pipe());
          if(result){
            this.userMessages = result;
            this.messagesLoaded = true;
          } else {
            this.messagesLoaded = true;
            this.userMessages = [];
            this.snackBar.open('User details return undefined.', 'dismiss', {
              duration: 2000
            });
          }
        }
      }
    } catch(err){
      console.error(err);
      this.messagesLoaded = true;
      this.userMessages = [];
      this.snackBar.open('Error loading user details.', 'dismiss', {
        duration: 2000
      });
    }
  }

  async checkReadReceipts(){
    let receivedMessages = this.userMessages.filter(message => {
      return message.userIDSentMessage !== this.user.userID && message.isRead == 0;
    });
    if(receivedMessages.length > 0 && receivedMessages.length == 1){
      let updateMessage = receivedMessages[0];
      updateMessage.isRead = 1;
      this.userMessageService.update(updateMessage).subscribe({
        next: this.handleUpdateResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    } else if(receivedMessages.length > 0 && receivedMessages.length > 1) {
      let updateString = ``;
      for(let i = 0; i < receivedMessages.length; i++){
        if(i == receivedMessages.length - 1){
          updateString += `${receivedMessages[i].userMessageID}`;
        } else {
          updateString += `${receivedMessages[i].userMessageID},`;
        }
      }
      let updateObj = {updateString};
      this.userMessageService.updateReadReceipts(updateObj).subscribe({
        next: this.handleUpdateResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    }
  }

  onSubmit(){
    if(this.isEdit){
      let editUserMessage: UserMessage = {
        userMessageID: 0,
        userChatID: 0,  
        userIDSentMessage: 0,
        userIDReceivedMessage: 0,
        userMessage: '',
        isRead: 0,
        isEdit: 0,
        messageImage: '',
        createdBy: 0,
        updatedBy: 0,
        createdAt: '',
        updatedAt: ''
      };
      editUserMessage.userMessageID = this.editMessage.userMessageID;
      editUserMessage.userChatID = this.editMessage.userChatID;
      editUserMessage.userIDSentMessage = this.editMessage.userIDSentMessage;
      editUserMessage.userIDReceivedMessage = this.editMessage.userIDReceivedMessage;
      editUserMessage.userMessage = this.userMessageForm.controls.userMessage.value ? this.userMessageForm.controls.userMessage.value: '';
      editUserMessage.messageImage = this.userMessageForm.controls.messageImage.value ? this.userMessageForm.controls.messageImage.value: '';
      editUserMessage.createdBy = this.editMessage.createdBy;
      editUserMessage.updatedBy = this.user.userID;
      editUserMessage.createdAt = this.editMessage.createdAt;
      editUserMessage.isRead = 0;
      editUserMessage.isEdit = 1;
      this.userMessageService.update(editUserMessage).subscribe({
        next: this.handleUpdateResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    } else {
      let newUserMessage: UserMessage = {
        userMessageID: 0,
        userChatID: 0,  
        userIDSentMessage: 0,
        userIDReceivedMessage: 0,
        userMessage: '',
        isRead: 0,
        isEdit: 0,
        messageImage: '',
        createdBy: 0,
        updatedBy: 0,
        createdAt: '',
        updatedAt: ''
      };
      newUserMessage.userChatID = this.userChat.userChatID;
      newUserMessage.userIDSentMessage = this.user.userID;
      newUserMessage.userIDReceivedMessage = this.otherUserID;
      newUserMessage.userMessage = this.userMessageForm.controls.userMessage.value ? this.userMessageForm.controls.userMessage.value: '';
      newUserMessage.messageImage = this.userMessageForm.controls.messageImage.value ? this.userMessageForm.controls.messageImage.value: '';
      newUserMessage.createdBy = this.user.userID;
      this.userMessageService.create(newUserMessage).subscribe({
        next: this.handleCreateResponse.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
    }
    
  }

  async handleCreateResponse(data: any) {
    if (data !== null && data !== undefined) {
      this.userMessageForm.reset();
      this.fileName = '';
      this.fileNameService.setFileNameObs('');
      this.messagesLoaded = false;
      await this.loadAllMessages();
      this.snackBar.open('Successfully created a new message!', 'dismiss', {
        duration: 3000
      });
    }
  }

  async handleUpdateResponse(data: any){
    if (data !== null && data !== undefined) {
      this.messagesLoaded = false;
      await this.loadAllMessages();
    }
  }

  loadImageEvent(imgCompressed: string){
    this.userMessageForm.controls.messageImage.patchValue(imgCompressed);
    this.userMessageForm.controls.messageImage.markAsDirty();
  }

  handleErrorResponse(error: any) {
    this.snackBar.open(error.message, 'dismiss', {
      duration: 3000
    });
  }

  public formatDate(date: any) {
    let formattedDate = this.dateFunction.formatDateTime(date);
    return formattedDate;
  }

  editUserMessage(message: UserMessage){
    this.isEdit = true;
    let userMessage = message.userMessage ? message.userMessage : '';
    this.userMessageForm.controls.userMessage.patchValue(userMessage);
    this.editMessage = message;
  }

  editImageMessage(message: UserMessage){
    this.isEdit = true;
    let messageImage = message.messageImage ? message.messageImage : '';
    this.userMessageForm.controls.messageImage.patchValue(messageImage);
    this.editMessage = message;
  }
}
