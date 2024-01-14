const db = require('../models/index');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

async function findCount(searchCriteria) {
    try {
        let sort = searchCriteria.sort;
        let sortDirection = searchCriteria.direction;
        let searchTerm = searchCriteria.searchTerm;
        let userBoards;
        if (searchTerm !== '') {
            if(searchCriteria.userID !== undefined && searchCriteria.userID !== null){
                where =  {
                    [Op.and]: {
                        [Op.or]: {
                            userBoardID: { [Op.like]: '%' + searchTerm + '%' },
                            boardID: { [Op.like]: '%' + searchTerm + '%' },
                            userID: { [Op.like]: '%' + searchTerm + '%' },
                            boardName: { [Op.like]: '%' + searchTerm + '%' },
                        }
                    },
                    userID: searchCriteria.userID                
                };
            } else {
                where =  {
                    [Op.or]: {
                        userBoardID: { [Op.like]: '%' + searchTerm + '%' },
                        boardID: { [Op.like]: '%' + searchTerm + '%' },
                        userID: { [Op.like]: '%' + searchTerm + '%' },
                        boardName: { [Op.like]: '%' + searchTerm + '%' },
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
        userBoards = await db.userBoard.findAll({
            where: where,
            order: [
                [sort, sortDirection],
                ['userBoardID', 'ASC'],
            ],
            attributes: ['userBoardID'],
            raw: true,
        });
        return userBoards.length;
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
            if(searchCriteria.userID !== undefined && searchCriteria.userID !== null){
                where = {
                    [Op.and]:{
                        [Op.or]: {
                            userBoardID: { [Op.like]: '%' + searchTerm + '%' },
                            boardID: { [Op.like]: '%' + searchTerm + '%' },
                            userID: { [Op.like]: '%' + searchTerm + '%' },
                            boardName: { [Op.like]: '%' + searchTerm + '%' },
                        },
                        userID: searchCriteria.userID
                    }
                };
            } else {
                where = {
                    [Op.or]: {
                        userBoardID: { [Op.like]: '%' + searchTerm + '%' },
                        boardID: { [Op.like]: '%' + searchTerm + '%' },
                        userID: { [Op.like]: '%' + searchTerm + '%' },
                        boardName: { [Op.like]: '%' + searchTerm + '%' },
                    }
                };
            }
        } else {
            if(searchCriteria.userID !== undefined && searchCriteria.userID !== null){
                where = {
                    userID: searchCriteria.userID
                }
            } else {
                where = '';
            }
        }
        if (pagination === 'true') {
            limit = searchCriteria.limit;
            if (page != 0) {
                offset = page * limit;
            }
            return await db.userBoard.findAll({
                where: where,
                order: [
                    [sort, sortDirection],
                    ['userBoardID', 'ASC'],
                ],
                limit: limit,
                offset: offset,
                raw: true,
            });
        } else {
            return await db.userBoard.findAll({
                where: where,
                order: [
                    [sort, sortDirection],
                    ['userBoardID', 'ASC'],
                ],
                raw: true,
            });
        }
    } catch (err) {
        console.log(err)
    }
}

async function create(userBoard){
    try{
        return await db.userBoard.create({
            boardID: userBoard.boardID,
            boardName: userBoard.boardName,
            userID: userBoard.userID,
            gameID: userBoard.gameID,
            gameName: userBoard.gameName
        });
    } catch(err){
        console.log(err)
        if(err.errors[0].type === 'unique violation'){
            return err.errors[0].message;
        }
    }
}

async function getOne(userBoardID){
    try{
        return await db.userBoard.findOne({
            where: {userBoardID: userBoardID},
            raw: true
        });
    } catch(err){
        console.log(err);
    }
}

async function update(userBoardID, userBoard){
    try{
        return result = await db.userBoard.update(
            userBoard,
            {
                where:{
                    userBoardID: userBoardID
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

async function deleteUserBoard(userBoardID) {
    try {
        return result = await db.userBoard.destroy({
            where: {
                userBoardID: userBoardID
            }
        });
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getAll,
    getOne,
    create,
    update,
    deleteUserBoard,
    findCount
};