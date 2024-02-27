import { User } from "./user.model";

export class UserChat {
    userChatID?: Number;
    userOneID?: Number;
    userTwoID?: Number;
    userOne?: User;
    userTwo?: User;
    createdBy?: Number;
    updatedBy?: Number;
    createdAt?: String;
    updatedAt?: String;
}