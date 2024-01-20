import { Game } from "./game.model";

export class UserGame {
    userGameID?: Number;
    gameID?: Number;
    gameName?: string;
    userID?: Number;
    gameEnjoymentRating?: Number;
    game?: Game;
    createdAt?: string;
    updatedAt?: string;
}