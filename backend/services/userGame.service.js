const db = require('../models/index');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

async function findCount(searchCriteria) {
    try {
        let sort = searchCriteria.sort;
        let sortDirection = searchCriteria.direction;
        let searchTerm = searchCriteria.searchTerm;
        let userGames;
        if (searchTerm !== '') {
            userGames = await db.userGame.findAll({
                where: {
                    [Op.or]: {
                        userGameID: { [Op.like]: '%' + searchTerm + '%' },
                        gameID: { [Op.like]: '%' + searchTerm + '%' },
                        userID: { [Op.like]: '%' + searchTerm + '%' },
                        gameEnjoymentRating: { [Op.like]: '%' + searchTerm + '%'}
                    }
                },
                order: [
                    [sort, sortDirection],
                    ['gameID', 'ASC'],
                ],
                attributes: ['gameID'],
                raw: true,
            });
        } else {
            userGames = await db.userGame.findAll({
                order: [
                    [sort, sortDirection],
                    ['gameID', 'ASC'],
                ],
                attributes: ['gameID'],
                raw: true,
            });
        }
        if (userGames !== null && userGames !== undefined) {
            return userGames.length
        } else {
            return 0;
        }
    } catch (err) {
        console.log(err)
    }
}

async function findCountByIDs(searchCriteria){
    try{
        let sort = searchCriteria.sort;
        let sortDirection = searchCriteria.direction;
        let searchTerm = searchCriteria.searchTerm;
        let userGames;
        if (searchTerm !== '') {
            if(searchTerm.includes(',')){
                searchTerm = searchTerm.split(',').map(Number);
                userGames = await db.userGame.findAll({
                    where: {
                        gameID: {
                            [Op.in]: searchTerm
                        }
                    },
                    order: [
                        [sort, sortDirection],
                        ['gameID', 'ASC'],
                    ],
                    attributes: ['gameID'],
                    raw: true,
                });
            } else {
                userGames = await db.userGame.findAll({
                    where: {
                        gameID: searchTerm
                    },
                    order: [
                        [sort, sortDirection],
                        ['gameID', 'ASC'],
                    ],
                    attributes: ['gameID'],
                    raw: true,
                });
            }
            if (userGames !== null && userGames !== undefined) {
                return userGames.length
            } else {
                return 0;
            }
        }
    }catch(err){
        console.log(err);
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
        if (searchTerm !== '') {
            if (pagination) {
                limit = searchCriteria.limit;
                if (page != 0) {
                    offset = page * limit;
                    return await db.userGame.findAll({
                        where: {
                            gameID: {
                                [Op.in]: searchTerm
                            }
                        },
                        order: [
                            [sort, sortDirection],
                            ['gameID', 'ASC'],
                        ],
                        limit: limit,
                        offset: offset,
                        attributes: [
                            'userGameID',
                            'gameID',
                            'userID',
                            'gameEnjoymentRating',
                            'createdAt',
                            'updatedAt'
                        ],
                        raw: true,
                    });
                } else {
                    return await db.userGame.findAll({
                        where: {
                            [Op.or]: {
                                userGameID: { [Op.like]: '%' + searchTerm + '%' },
                                gameID: { [Op.like]: '%' + searchTerm + '%' },
                                userID: { [Op.like]: '%' + searchTerm + '%' },
                                gameEnjoymentRating: { [Op.like]: '%' + searchTerm + '%' }
                            }
                        },
                        order: [
                            [sort, sortDirection],
                            ['gameID', 'ASC'],
                        ],
                        limit: limit,
                        attributes: [
                            'userGameID',
                            'gameID',
                            'userID',
                            'gameEnjoymentRating',
                            'createdAt',
                            'updatedAt'
                        ],
                        raw: true,
                    });
                }
            } else {
                return await db.userGame.findAll({
                    where: {
                        [Op.or]: {
                            userGameID: { [Op.like]: '%' + searchTerm + '%' },
                            gameID: { [Op.like]: '%' + searchTerm + '%' },
                            userID: { [Op.like]: '%' + searchTerm + '%' },
                            gameEnjoymentRating: { [Op.like]: '%' + searchTerm + '%' }
                        }
                    },
                    order: [
                        [sort, sortDirection],
                        ['gameID', 'ASC'],
                    ],
                    attributes: [
                        'userGameID',
                        'gameID',
                        'userID',
                        'gameEnjoymentRating',
                        'createdAt',
                        'updatedAt'
                    ],
                    raw: true,
                });
            }
        } else {
            if (pagination) {
                limit = searchCriteria.limit;
                if (page != 0) {
                    offset = page * limit;
                    return await db.userGame.findAll({
                        order: [
                            [sort, sortDirection],
                            ['gameID', 'ASC'],
                        ],
                        limit: limit,
                        offset: offset,
                        attributes: [
                            'userGameID',
                            'gameID',
                            'userID',
                            'gameEnjoymentRating',
                            'createdAt',
                            'updatedAt'
                        ],
                        raw: true,
                    });
                } else {
                    return await db.userGame.findAll({
                        order: [
                            [sort, sortDirection],
                            ['gameID', 'ASC'],
                        ],
                        limit: limit,
                        attributes: [
                            'userGameID',
                            'gameID',
                            'userID',
                            'gameEnjoymentRating',
                            'createdAt',
                            'updatedAt'
                        ],
                        raw: true,
                    });
                }
            } else {
                return await db.userGame.findAll({
                    order: [
                        [sort, sortDirection],
                        ['gameID', 'ASC'],
                    ],
                    attributes: [
                        'userGameID',
                        'gameID',
                        'userID',
                        'gameEnjoymentRating',
                        'createdAt',
                        'updatedAt'
                    ],
                    raw: true,
                });
            }
        }
    } catch (err) {
        console.log(err)
    }
}

async function getAllUserGamesByIDs(searchCriteria){
    try{
        let sort = searchCriteria.sort;
        let sortDirection = searchCriteria.direction;
        let pagination = searchCriteria.pagination;
        let searchTerm = searchCriteria.searchTerm;
        let limit;
        let offset;
        let page = searchCriteria.page;
        if (searchTerm !== '') {
            if(searchTerm.includes(',')){
                searchTerm = searchTerm.split(',').map(Number);
                if (pagination) {
                    limit = searchCriteria.limit;
                    if (page != 0) {
                        offset = page * limit;
                        return await db.userGame.findAll({
                            where: {
                                gameID: {
                                    [Op.in]: searchTerm
                                }
                            },
                            order: [
                                [sort, sortDirection],
                                ['gameID', 'ASC'],
                            ],
                            limit: limit,
                            offset: offset,
                            attributes: [
                                'userGameID',
                                'gameID',
                                'userID',
                                'gameEnjoymentRating',
                                'createdAt',
                                'updatedAt'
                            ],
                            raw: true,
                        });
                    } else {
                        return await db.userGame.findAll({
                            where: {
                                gameID: {
                                    [Op.in]: searchTerm
                                }
                            },
                            order: [
                                [sort, sortDirection],
                                ['gameID', 'ASC'],
                            ],
                            limit: limit,
                            attributes: [
                                'userGameID',
                                'gameID',
                                'userID',
                                'gameEnjoymentRating',
                                'createdAt',
                                'updatedAt'
                            ],
                            raw: true,
                        });
                    }
                } else {
                    return userGames = await db.userGame.findAll({
                        where: {
                            gameID: {
                                [Op.in]: searchTerm
                            }
                        },
                        order: [
                            [sort, sortDirection],
                            ['gameID', 'ASC'],
                        ],
                        attributes: [
                            'userGameID',
                            'gameID',
                            'userID',
                            'gameEnjoymentRating',
                            'createdAt',
                            'updatedAt'
                        ],
                        raw: true,
                    });
                }
            } else {
                if (pagination) {
                    limit = searchCriteria.limit;
                    if (page != 0) {
                        offset = page * limit;
                        return await db.userGame.findAll({
                            where: {
                                gameID: searchTerm
                            },
                            order: [
                                [sort, sortDirection],
                                ['gameID', 'ASC'],
                            ],
                            limit: limit,
                            offset: offset,
                            attributes: [
                                'userGameID',
                                'gameID',
                                'userID',
                                'gameEnjoymentRating',
                                'createdAt',
                                'updatedAt'
                            ],
                            raw: true,
                        });
                    } else {
                        return await db.userGame.findAll({
                            where: {
                                gameID: searchTerm
                            },
                            order: [
                                [sort, sortDirection],
                                ['gameID', 'ASC'],
                            ],
                            limit: limit,
                            attributes: [
                                'userGameID',
                                'gameID',
                                'userID',
                                'gameEnjoymentRating',
                                'createdAt',
                                'updatedAt'
                            ],
                            raw: true,
                        });
                    }
                } else {
                    return userGames = await db.userGame.findAll({
                        where: {
                            gameID: searchTerm
                        },
                        order: [
                            [sort, sortDirection],
                            ['gameID', 'ASC'],
                        ],
                        attributes: [
                            'userGameID',
                            'gameID',
                            'userID',
                            'gameEnjoymentRating',
                            'createdAt',
                            'updatedAt'
                        ],
                        raw: true,
                    });
                }
            }
        }
    } catch(err){
        console.log(err);
    }
}

async function createUserGame(userGame) {
    try {
        return await db.userGame.create({
            userGameID: userGame.userGameID,
            gameID: userGame.gameID,
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
    getAllUserGamesByIDs,
    findCount,
    findCountByIDs,
    getOneUserGame,
    createUserGame,
    updateUserGame,
    deleteUserGame
};