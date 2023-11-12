const db = require('../models/index');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

async function findCount(searchCriteria) {
    try {
        let sort = searchCriteria.sort;
        let sortDirection = searchCriteria.direction;
        let searchTerm = searchCriteria.searchTerm;
        let userGames;
        let where;
        if (searchTerm !== '') {
            where = {
                [Op.or]: {
                    userGameID: { [Op.like]: '%' + searchTerm + '%' },
                    gameID: { [Op.like]: '%' + searchTerm + '%' },
                    gameName: { [Op.like]: '%' + searchTerm + '%' },
                    userID: { [Op.like]: '%' + searchTerm + '%' },
                    gameEnjoymentRating: { [Op.like]: '%' + searchTerm + '%'}
                }
            };
        } else {
            where = '';
        }
        userGames = await db.userGame.findAll({
            where: where,
            order: [
                [sort, sortDirection],
                ['gameID', 'ASC'],
            ],
            attributes: ['gameID'],
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
            where = {
                [Op.or]: {
                    userGameID: { [Op.like]: '%' + searchTerm + '%' },
                    gameID: { [Op.like]: '%' + searchTerm + '%' },
                    gameName: { [Op.like]: '%' + searchTerm + '%' },
                    userID: { [Op.like]: '%' + searchTerm + '%' },
                    gameEnjoymentRating: { [Op.like]: '%' + searchTerm + '%'}
                }
            };
        } else {
            where = '';
        }
        if (pagination) {
            limit = searchCriteria.limit;
            if (page != 0) {
                offset = page * limit;
            }
        }
        return await db.userGame.findAll({
            where: where,
            order: [
                [sort, sortDirection],
                ['gameID', 'ASC'],
            ],
            limit: limit,
            offset: offset,
            attributes: [
                'userGameID',
                'gameID',
                'gameName',
                'userID',
                'gameEnjoymentRating',
                'createdAt',
                'updatedAt'
            ],
            raw: true,
        });
    } catch (err) {
        console.log(err)
    }
}

async function createUserGame(userGame) {
    try {
        return await db.userGame.create({
            userGameID: userGame.userGameID,
            gameID: userGame.gameID,
            gameName: userGame.gameName,
            userID: userGame.userID,
            gameEnjoymentRating: userGame.gameEnjoymentRating,
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
        return await db.userGame.findOne({
            where: { userGameID: userGameID },
            raw: true
        });
    } catch (err) {
        console.log(err);
    }
}

async function updateUserGame(userGameID, userGame) {
    try {
        return result = await db.userGame.update(
            userGame,
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
        return result = await db.userGame.destroy({
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
    createUserGame,
    updateUserGame,
    deleteUserGame
};