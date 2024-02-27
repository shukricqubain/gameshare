import { User } from "./user.model";
import { UserChat } from './userChat.model';

export class UserMessage {
    userMessageID?: Number;
    userChatID?: Number;
    userChat?: UserChat;
    userIDSentMessage?: Number;
    userIDReceivedMessage?: Number;
    SentBy?: User;
    ReceivedBy?: User;
    userMessage?: String;
    isRead?: boolean;
    messageImage?: string;
    createdBy?: Number;
    updatedBy?: Number;
    createdAt?: String;
    updatedAt?: String;
}