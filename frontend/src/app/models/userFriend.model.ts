import { User } from "./user.model";

export class UserFriend {
    userFriendID?: Number;
    userIDSentRequest?: Number;
    userIDReceivedRequest?: Number;
    SentBy?: User;
    ReceivedBy?: User;
    areFriends?: String;
    createdBy?: Number;
    updatedBy?: Number;
    createdAt?: String;
    updatedAt?: String;
}