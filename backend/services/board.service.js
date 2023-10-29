const db = require('../models/index');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

async function findCount(searchCriteria) {
    try {
        let sort = searchCriteria.sort;
        let sortDirection = searchCriteria.direction;
        let searchTerm = searchCriteria.searchTerm;
        let boards;
        if (searchTerm !== '') {
            boards = await db.board.findAll({
                where: {
                    [Op.or]: {
                        boardID: { [Op.like]: '%' + searchTerm + '%' },
                        boardName: { [Op.like]: '%' + searchTerm + '%' },
                        gameID: { [Op.like]: '%' + searchTerm + '%' },
                        gameName: { [Op.like]: '%' + searchTerm + '%' }
                    
                    }
                },
                order: [
                    [sort, sortDirection],
                    ['boardName', 'ASC'],
                ],
                attributes: ['boardID'],
                raw: true,
            });
        } else {
            boards = await db.board.findAll({
                order: [
                    [sort, sortDirection],
                    ['boardName', 'ASC'],
                ],
                attributes: ['boardID'],
                raw: true,
            });
        }
        return boards.length;
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
        if (searchTerm !== '') {
            if (pagination) {
                limit = searchCriteria.limit;
                if (page != 0) {
                    offset = page * limit;
                    return await db.board.findAll({
                        where: {
                            [Op.or]: {
                                boardID: { [Op.like]: '%' + searchTerm + '%' },
                                boardName: { [Op.like]: '%' + searchTerm + '%' },
                                gameID: { [Op.like]: '%' + searchTerm + '%' },
                                gameName: { [Op.like]: '%' + searchTerm + '%' }
                            
                            }
                        },
                        order: [
                            [sort, sortDirection],
                            ['boardName', 'ASC'],
                        ],
                        limit: limit,
                        offset: offset,
                        raw: true,
                    });
                } else {
                    return await db.board.findAll({
                        where: {
                            [Op.or]: {
                                boardID: { [Op.like]: '%' + searchTerm + '%' },
                                boardName: { [Op.like]: '%' + searchTerm + '%' },
                                gameID: { [Op.like]: '%' + searchTerm + '%' },
                                gameName: { [Op.like]: '%' + searchTerm + '%' }
                            
                            }
                        },
                        order: [
                            [sort, sortDirection],
                            ['boardName', 'ASC'],
                        ],
                        limit: limit,
                        raw: true,
                    });
                }
            } else {
                return await db.board.findAll({
                    where: {
                        [Op.or]: {
                            boardID: { [Op.like]: '%' + searchTerm + '%' },
                            boardName: { [Op.like]: '%' + searchTerm + '%' },
                            gameID: { [Op.like]: '%' + searchTerm + '%' },
                            gameName: { [Op.like]: '%' + searchTerm + '%' }
                        
                        }
                    },
                    order: [
                        [sort, sortDirection],
                        ['boardName', 'ASC'],
                    ],
                    raw: true,
                });
            }
        } else {
            if (pagination) {
                limit = searchCriteria.limit;
                if (page != 0) {
                    offset = page * limit;
                    return await db.board.findAll({
                        order: [
                            [sort, sortDirection],
                            ['boardName', 'ASC'],
                        ],
                        limit: limit,
                        offset: offset,
                        raw: true,
                    });
                } else {
                    return await db.board.findAll({
                        order: [
                            [sort, sortDirection],
                            ['boardName', 'ASC'],
                        ],
                        limit: limit,
                        raw: true,
                    });
                }
            } else {
                return await db.board.findAll({
                    order: [
                        [sort, sortDirection],
                        ['boardName', 'ASC'],
                    ],
                    raw: true,
                });
            }
        }

    } catch (err) {
        console.log(err)
    }
}

async function getAllBoardNames(){
    try{
        return await db.board.findAll({
            order: [
                ['boardName', 'ASC'],
            ],
            attributes: [
                'boardID',
                'boardName',
            ],
            raw: true
        });
    } catch(err){
        console.log(err);
    }
}

async function create(board){
    try{
        return await db.board.create({
            boardID: board.boardID,
            boardName: board.boardName,
            gameID: board.gameID,
            gameName: board.gameName
        });
    } catch(err){
        console.log(err)
        if(err.errors[0].type === 'unique violation'){
            return err.errors[0].message;
        }
    }
}

async function getOne(boardID){
    try{
        return await db.board.findOne({
            where: {boardID: boardID},
            raw: true
        });
    } catch(err){
        console.log(err);
    }
}

async function update(boardID, board){
    try{
        return result = await db.board.update(
            board,
            {
                where:{
                    boardID: boardID
                }
            }
        );
    } catch(err){
        console.log(err);
        if(err.errors[0].type === 'unique violation'){
            return err.errors[0].message;
        }
    }
}

async function deleteBoard(boardID) {
    try {
        return result = await db.board.destroy({
            where: {
                boardID: boardID
            }
        });
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getAll,
    getOne,
    getAllBoardNames,
    create,
    update,
    deleteBoard,
    findCount
};