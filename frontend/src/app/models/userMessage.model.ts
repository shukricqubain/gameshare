import { User } from "./user.model";

export class UserMessage {
    userMessageID?: Number;
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