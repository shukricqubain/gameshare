const db = require('../models/index');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
const userGame = db.userGame;
const game = db.game;

game.hasMany(userGame, {
    foreignKey: 'gameID'
});
userGame.belongsTo(game,{
    foreignKey: 'gameID'
});



async function findCount(searchCriteria) {
    try {
        let sort = searchCriteria.sort;
        let sortDirection = searchCriteria.direction;
        let searchTerm = searchCriteria.searchTerm;
        let userGames;
        let where;
        if (searchTerm !== '') {
            if(searchCriteria.userID !== undefined && searchCriteria.userID !== null){
                where = {
                    [Op.and]: {
                        [Op.or]: {
                            userGameID: { [Op.like]: '%' + searchTerm + '%' },
                            gameID: { [Op.like]: '%' + searchTerm + '%' },
                            gameName: { [Op.like]: '%' + searchTerm + '%' },
                            userID: { [Op.like]: '%' + searchTerm + '%' },
                            gameEnjoymentRating: { [Op.like]: '%' + searchTerm + '%'}
                        },
                        userID: searchCriteria.userID
                    }
                };
            } else {
                where = {
                    [Op.or]: {
                        userGameID: { [Op.like]: '%' + searchTerm + '%' },
                        gameID: { [Op.like]: '%' + searchTerm + '%' },
                        gameName: { [Op.like]: '%' + searchTerm + '%' },
                        userID: { [Op.like]: '%' + searchTerm + '%' },
                        gameEnjoymentRating: { [Op.like]: '%' + searchTerm + '%'}
                    }
                };
            }
        } else {
            if(searchCriteria.userID !== undefined && searchCriteria.userID !== null){
                where = {
                    userID: searchCriteria.userID
                };
            } else {
                where = '';
            }   
        }
        userGames = await userGame.findAll({
            where: where,
            order: [
                [sort, sortDirection],
                ['userGameID', 'ASC'],
            ],
            attributes: ['userGameID'],
            raw: true,
        });
        if (userGames !== null && userGames !== undefined) {
            return userGames.length
        } else {
            return 0;
        }
    } catch (err) {
        console.log(err)
    }
}

async function getAllUserGames(searchCriteria) {
    try {
        let sort = searchCriteria.sort;
        let sortDirection = searchCriteria.direction;
        let pagination = searchCriteria.pagination;
        let searchTerm = searchCriteria.searchTerm;
        let limit;
        let offset;
        let page = searchCriteria.page;
        let where;
        if (searchTerm !== '') {
            if(searchCriteria.userID !== undefined && searchCriteria.userID !== null){
                where = {
                    [Op.and]:{
                        [Op.or]: {
                            userGameID: { [Op.like]: '%' + searchTerm + '%' },
                            gameID: { [Op.like]: '%' + searchTerm + '%' },
                            gameName: { [Op.like]: '%' + searchTerm + '%' },
                            userID: { [Op.like]: '%' + searchTerm + '%' },
                            gameEnjoymentRating: { [Op.like]: '%' + searchTerm + '%'}
                        },
                        userID: searchCriteria.userID
                    }
                };
            } else {
                where = {
                    [Op.or]: {
                        userGameID: { [Op.like]: '%' + searchTerm + '%' },
                        gameID: { [Op.like]: '%' + searchTerm + '%' },
                        gameName: { [Op.like]: '%' + searchTerm + '%' },
                        userID: { [Op.like]: '%' + searchTerm + '%' },
                        gameEnjoymentRating: { [Op.like]: '%' + searchTerm + '%'}
                    }
                };
            }
        } else {
            if(searchCriteria.userID !== undefined && searchCriteria.userID !== null){
                where = {
                    userID: searchCriteria.userID
                };
            } else {
                where = '';
            }
        }
        if (pagination === 'true') {
            limit = searchCriteria.limit;
            if (page != 0) {
                offset = page * limit;
            }
            let userGames = await userGame.findAll({
                where: where,
                include: { 
                    model: game,
                    attributes: [
                        'gameCoverFileName'
                    ]
                },
                order: [
                    [sort, sortDirection],
                    ['userGameID', 'ASC'],
                ],
                limit: limit,
                offset: offset,
            });
            return userGames;
        } else {
            return await userGame.findAll({
                where: where,
                include: { 
                    model: game,
                    attributes: [
                        'gameCoverFileName'
                    ]
                },
                order: [
                    [sort, sortDirection],
                    ['userGameID', 'ASC'],
                ],
            });
        }
    } catch (err) {
        console.log(err)
    }
}

async function createUserGame(newUserGame) {
    try {
        return await userGame.create({
            userGameID: newUserGame.userGameID,
            gameID: newUserGame.gameID,
            gameName: newUserGame.gameName,
            userID: newUserGame.userID,
            gameEnjoymentRating: newUserGame.gameEnjoymentRating,
        });
    } catch (err) {
        console.log(err)
        if (err.errors[0].type === 'unique violation') {
            return err.errors[0].message;
        }
    }
}

async function getOneUserGame(userGameID) {
    try {
        return await userGame.findOne({
            where: { userGameID: userGameID },
            raw: true
        });
    } catch (err) {
        console.log(err);
    }
}

async function findOneByUserIDAndGameID(body) {
    try {
        let userID = body.userID;
        let gameID = body.gameID;
        return await userGame.findOne({
            where: { 
                userID: userID,
                gameID: gameID
             },
            raw: true
        });
    } catch (err) {
        console.log(err);
    }
}

async function findGameHighlights(userID){
    try {
        return await userGame.findAll({
            attributes: [
                'userGameID',
                'userID',
                'gameEnjoymentRating',
                [Sequelize.col("game.gameID"), "gameID"],
                [Sequelize.col("game.gameName"), "gameName"],
                [Sequelize.col("game.developers"), "developers"],
                [Sequelize.col('game.publishers'), "publishers"],
                [Sequelize.col('game.genre'), 'genre'],
                [Sequelize.col('game.releaseDate'),'releaseDate'],
                [Sequelize.col('game.gameCoverFileName'),'gameCoverFileName'],
                [Sequelize.col('game.platform'),'platform'],
            ],
            include: [
                {
                    model: game,
                },
            ],
            where: { 
                userID: userID,
             },
            raw: true
        });
    } catch (err) {
        console.log(err);
    }
}

async function updateUserGame(userGameID, updatedUserGame) {
    try {
        return result = await userGame.update(
            updatedUserGame,
            {
                where: {
                    userGameID: userGameID
                }
            }
        );
    } catch (err) {
        console.log(err);
        if (err.errors[0].type === 'unique violation') {
            return err.errors[0].message;
        }
    }
}

async function deleteUserGame(userGameID) {
    try {
        return result = await userGame.destroy({
            where: {
                userGameID: userGameID
            }
        });
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getAllUserGames,
    findCount,
    getOneUserGame,
    findOneByUserIDAndGameID,
    findGameHighlights,
    createUserGame,
    updateUserGame,
    deleteUserGame
};