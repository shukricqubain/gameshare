const db = require('../models/index');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

async function findCount(searchCriteria) {
    try {
        let sort = searchCriteria.sort;
        let sortDirection = searchCriteria.direction;
        let searchTerm = searchCriteria.threadSearchTerm;
        let userThreads;
        let where;
        if (searchTerm !== '') {
            if(searchCriteria.userID !== undefined && searchCriteria.userID !== null){
                where = {
                    [Op.and]:{
                        [Op.or]: {
                            userThreadID: { [Op.like]: '%' + searchTerm + '%' },
                            threadID: { [Op.like]: '%' + searchTerm + '%' }, 
                            boardID: { [Op.like]: '%' + searchTerm + '%' },
                            boardName: { [Op.like]: '%' + searchTerm + '%' },
                            threadName: { [Op.like]: '%' + searchTerm + '%' },
                            userID: { [Op.like]: '%' + searchTerm + '%' }
                        },
                        userID: searchCriteria.userID
                    }                    
                };
            } else {
                where = {
                    [Op.or]: {
                        userThreadID: { [Op.like]: '%' + searchTerm + '%' },
                        threadID: { [Op.like]: '%' + searchTerm + '%' }, 
                        boardID: { [Op.like]: '%' + searchTerm + '%' },
                        boardName: { [Op.like]: '%' + searchTerm + '%' },
                        threadName: { [Op.like]: '%' + searchTerm + '%' },
                        userID: { [Op.like]: '%' + searchTerm + '%' }
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
        userThreads = await db.userThread.findAll({
            where: where,
            order: [
                [sort, sortDirection],
                ['threadName', 'ASC'],
            ],
            attributes: ['userThreadID'],
            raw: true,
        });
        return userThreads.length;
    } catch (err) {
        console.log(err)
    }
}

async function getAll(searchCriteria) {
    try {
        let sort = searchCriteria.sort;
        let sortDirection = searchCriteria.direction;
        let pagination = searchCriteria.pagination;
        let searchTerm = searchCriteria.threadSearchTerm;
        let limit;
        let offset;
        let page = searchCriteria.page;
        let where;
        if (searchTerm !== '') {
            if(searchCriteria.userID !== undefined && searchCriteria.userID !== null){
                where = {
                    [Op.and]:{
                        [Op.or]: {
                            userThreadID: { [Op.like]: '%' + searchTerm + '%' },
                            threadID: { [Op.like]: '%' + searchTerm + '%' }, 
                            boardID: { [Op.like]: '%' + searchTerm + '%' },
                            boardName: { [Op.like]: '%' + searchTerm + '%' },
                            threadName: { [Op.like]: '%' + searchTerm + '%' },
                            userID: { [Op.like]: '%' + searchTerm + '%' }
                        },
                        userID: searchCriteria.userID
                    }                    
                };
            } else {
                where = {
                    [Op.or]: {
                        userThreadID: { [Op.like]: '%' + searchTerm + '%' },
                        threadID: { [Op.like]: '%' + searchTerm + '%' }, 
                        boardID: { [Op.like]: '%' + searchTerm + '%' },
                        boardName: { [Op.like]: '%' + searchTerm + '%' },
                        threadName: { [Op.like]: '%' + searchTerm + '%' },
                        userID: { [Op.like]: '%' + searchTerm + '%' }
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
            return await db.userThread.findAll({
                where: where,
                order: [
                    [sort, sortDirection],
                    ['threadName', 'ASC'],
                ],
                limit: limit,
                offset: offset,
                raw: true,
            });
        } else {
            return await db.userThread.findAll({
                where: where,
                order: [
                    [sort, sortDirection],
                    ['threadName', 'ASC'],
                ],
                raw: true,
            });
        }
    } catch (err) {
        console.log(err)
    }
}

async function create(userThread){
    try{
        return await db.userThread.create({
            userThreadID: userThread.userThreadID,
            threadID: userThread.threadID,
            boardID: userThread.boardID,
            boardName: userThread.boardName,
            userID: userThread.userID,
            threadName: userThread.threadName
        });
    } catch(err){
        console.log(err)
        if(err.errors[0].type === 'unique violation'){
            return err.errors[0].message;
        }
    }
}

async function getOne(userThreadID){
    try{
        return await db.userThread.findOne({
            where: {userThreadID: userThreadID},
            raw: true
        });
    } catch(err){
        console.log(err);
    }
}

async function update(userThreadID, userThread){
    try{
        return result = await db.userThread.update(
            userThread,
            {
                where:{
                    userThreadID: userThreadID
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

async function deleteUserThread(userThreadID) {
    try {
        return result = await db.userThread.destroy({
            where: {
                userThreadID: userThreadID
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
    deleteUserThread,
    findCount
};