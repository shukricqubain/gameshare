const db = require('../models/index');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

async function findCount(searchCriteria) {
    try {
        let sort = searchCriteria.sort;
        let sortDirection = searchCriteria.direction;
        let searchTerm = searchCriteria.searchTerm;
        let games;
        let where;
        if (searchTerm !== '') {
            where = {
                [Op.or]: {
                    gameID: { [Op.like]: '%' + searchTerm + '%' },
                    gameName: { [Op.like]: '%' + searchTerm + '%' },
                    developers: { [Op.like]: '%' + searchTerm + '%' },
                    publishers: { [Op.like]: '%' + searchTerm + '%' },
                    genre: { [Op.like]: '%' + searchTerm + '%' },
                    releaseDate: { [Op.like]: '%' + searchTerm + '%' },
                    platform: { [Op.like]: '%' + searchTerm + '%' }
                }
            };
        } else {
            where = '';
        }
        games = await db.game.findAll({
            where: where,
            order: [
                [sort, sortDirection],
                ['gameName', 'ASC'],
            ],
            attributes: ['gameID'],
            raw: true,
        });
        return games.length;
    } catch (err) {
        console.log(err)
    }
}

async function getAll(searchCriteria) {
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
                    gameID: { [Op.like]: '%' + searchTerm + '%' },
                    gameName: { [Op.like]: '%' + searchTerm + '%' },
                    developers: { [Op.like]: '%' + searchTerm + '%' },
                    publishers: { [Op.like]: '%' + searchTerm + '%' },
                    genre: { [Op.like]: '%' + searchTerm + '%' },
                    releaseDate: { [Op.like]: '%' + searchTerm + '%' },
                    platform: { [Op.like]: '%' + searchTerm + '%' }
                }
            };
        } else {
            where = '';
        }
        if (pagination === 'true') {
            limit = searchCriteria.limit;
            if (page != 0) {
                offset = page * limit;
            }
            return await db.game.findAll({
                where: where,
                order: [
                    [sort, sortDirection],
                    ['gameName', 'ASC'],
                ],
                limit: limit,
                offset: offset,
                raw: true,
            });
        } else {
            return await db.game.findAll({
                where: where,
                order: [
                    [sort, sortDirection],
                    ['gameName', 'ASC'],
                ],
                raw: true,
            });
        }
    } catch (err) {
        console.log(err)
    }
}

async function create(game) {
    try {
        return await db.game.create({
            gameID: game.gameID,
            gameName: game.gameName,
            developers: game.developers,
            publishers: game.publishers,
            genre: game.genre,
            releaseDate: game.releaseDate,
            platform: game.platform,
            gameCoverFileName: game.gameCoverFileName
        });
    } catch (err) {
        console.log(err)
        if (err.errors[0].type === 'unique violation') {
            return err.errors[0].message;
        }
    }
}

async function getOne(gameID) {
    try {
        return await db.game.findOne({
            where: { gameID: gameID },
            raw: true
        });
    } catch (err) {
        console.log(err);
    }
}

async function getOneByName(gameName) {
    try {
        return await db.game.findOne({
            where: { gameName: gameName },
            raw: true
        });
    } catch (err) {
        console.log(err);
    }
}

async function getAllGameNames() {
    try {
        return await db.game.findAll({
            order: [
                ['gameName', 'ASC'],
            ],
            attributes: [
                'gameID',
                'gameName',
            ],
            raw: true
        });
    } catch (err) {
        console.log(err);
    }
}

async function update(gameID, game) {
    try {
        return result = await db.game.update(
            game,
            {
                where: {
                    gameID: gameID
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

async function deleteGame(gameID) {
    try {
        return result = await db.game.destroy({
            where: {
                gameID: gameID
            }
        });
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getAll,
    getOneByName,
    getAllGameNames,
    findCount,
    getOne,
    create,
    update,
    deleteGame
};