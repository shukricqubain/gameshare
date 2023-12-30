const userGameService = require('../services/userGame.service');

// Create and Save a new userGame
exports.create = async (req) => {
    try{
        let result = await userGameService.createUserGame(req);
        return result;
    } catch(err){
        console.log(err)
    }
};

// Get count of userGame
exports.findCount = async (searchCriteria) => {
    try{
        let gameCount = await userGameService.findCount(searchCriteria);
        if(gameCount > 0){
            return gameCount;
        } else {
            return {message: 'No data in user game table to fetch.'};
        }
    } catch(err){
        console.log(err);
    }
};

// Get count of userGame by IDs
exports.findCountByIDs = async (searchCriteria) => {
    try{
        let gameCount = await userGameService.findCountByIDs(searchCriteria);
        if(gameCount > 0){
            return gameCount;
        } else {
            return {message: 'No data in user game table to fetch.'};
        }
    } catch(err){
        console.log(err);
    }
};

// Get all userGame
exports.findAll = async (searchCriteria) => {
    try{
        let allGames = await userGameService.getAllUserGames(searchCriteria);
        if(allGames.length > 0){
            return allGames;
        } else {
            return {message: 'No data in userGame table to fetch.'};
        }
    } catch(err){
        console.log(err);
    }
};

// Get userGame by userID and gameID
exports.findOneByUserIDAndGameID = async (req) => {
    try{
        let userGame = await userGameService.findOneByUserIDAndGameID(req);
        if(userGame !== null){
            return userGame;
        } else {
            return 'Cannot find game with specified userID and GameID';
        }
    } catch(err){
        console.log(err);
    }
};

// Get single userGame by id
exports.findOne = async (req) => {
    try{
        let game = await userGameService.getOneUserGame(req);
        if(game == null){
            return 'Cannot find game with specified userGameID';
        } else {
            return game;
        }
    } catch(err){
        console.log(err);
    }
};

// Update a userGame by their id
exports.update = async (userGameID, userGame) => {
    try{
        return await userGameService.updateUserGame(userGameID, userGame);
    } catch(err){
        console.log(err);
    }
};

// Delete a userGame by their id
exports.delete = async (userGameID) => {
    try{
        return await userGameService.deleteUserGame(userGameID);
    } catch(err){
        console.log(err);
    }
};