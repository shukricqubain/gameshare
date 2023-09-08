const gameService = require('../services/game.service');

// Create and Save a new token
exports.create = async (req) => {
    try{
        let result = await gameService.create(req);
        return result;
    } catch(err){
        console.log(err)
    }
};

// Get count of games
exports.findCount = async (searchCriteria) => {
    try{
        let gameCount = await gameService.findCount(searchCriteria);
        if(gameCount > 0){
            return gameCount;
        } else {
            return {message: 'No data in game table to fetch.'};
        }
    } catch(err){
        console.log(err);
    }
};

// Get all games
exports.findAll = async (searchCriteria) => {
    try{
        let allGames = await gameService.getAll(searchCriteria);
        if(allGames.length > 0){
            return allGames;
        } else {
            return {message: 'No data in game table to fetch.'};
        }
    } catch(err){
        console.log(err);
    }
};

// Get single game by id
exports.findOne = async (req) => {
    try{
        let game = await gameService.getOne(req);
        if(game == null){
            return 'Cannot find game with specified gameID';
        } else {
            return game;
        }
    } catch(err){
        console.log(err);
    }
};

// Get single game by name
exports.findOneByName = async (req) => {
    try{
        let game = await gameService.getOneByName(req);
        if(game == null){
            return 'Cannot find game with specified gameName';
        } else {
            return game;
        }
    } catch(err){
        console.log(err);
    }
};

// Update a game by their id
exports.update = async (gameID, game) => {
    try{
        return await gameService.update(gameID, game);
    } catch(err){
        console.log(err);
    }
};

// Delete a game by their id
exports.delete = async (gameID) => {
    try{
        return await gameService.deleteGame(gameID);
    } catch(err){
        console.log(err);
    }
};