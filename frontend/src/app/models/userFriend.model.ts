import { User } from "./user.model";

export class UserFriend {
    userFriendID?: number;
    userIDSentRequest?: number;
    userIDReceivedRequest?: number;
    SentBy?: User;
    ReceivedBy?: User;
    areFriends?: string;
    createdBy?: number;
    updatedBy?: number;
    createdAt?: string;
    updatedAt?: string;
    receivedByProfilePicture?: string;
    sentByProfilePicture?: string;
    receivedByUserName?: string;
    sentByUserName?: string;
    mutualFriends?: UserFriend[];
}