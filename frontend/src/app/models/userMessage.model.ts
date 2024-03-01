import { User } from "./user.model";
import { UserChat } from './userChat.model';

export class UserMessage {
    userMessageID?: number;
    userChatID?: number;
    userChat?: UserChat;
    userIDSentMessage?: number;
    userIDReceivedMessage?: number;
    SentBy?: User;
    ReceivedBy?: User;
    userMessage?: string;
    isRead?: number;
    messageImage?: string;
    createdBy?: number;
    updatedBy?: number;
    createdAt?: string;
    updatedAt?: string;
}