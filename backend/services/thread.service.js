const db = require('../models/index');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

async function findCount(searchCriteria) {
    try {
        let sort = searchCriteria.sort;
        let sortDirection = searchCriteria.direction;
        let searchTerm = searchCriteria.searchTerm;
        let threads;
        if (searchTerm !== '') {
            threads = await db.thread.findAll({
                where: {
                    [Op.or]: {
                        threadID: { [Op.like]: '%' + searchTerm + '%' }, 
                        boardID: { [Op.like]: '%' + searchTerm + '%' },
                        threadName: { [Op.like]: '%' + searchTerm + '%' },
                        userID: { [Op.like]: '%' + searchTerm + '%' }
                    }
                },
                order: [
                    [sort, sortDirection],
                    ['threadName', 'ASC'],
                ],
                attributes: ['threadID'],
                raw: true,
            });
        } else {
            threads = await db.thread.findAll({
                order: [
                    [sort, sortDirection],
                    ['threadName', 'ASC'],
                ],
                attributes: ['threadID'],
                raw: true,
            });
        }
        return threads.length;
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
                    return await db.thread.findAll({
                        where: {
                            [Op.or]: {
                                threadID: { [Op.like]: '%' + searchTerm + '%' }, 
                                boardID: { [Op.like]: '%' + searchTerm + '%' },
                                threadName: { [Op.like]: '%' + searchTerm + '%' },
                                userID: { [Op.like]: '%' + searchTerm + '%' }
                            }
                        },
                        order: [
                            [sort, sortDirection],
                            ['threadName', 'ASC'],
                        ],
                        limit: limit,
                        offset: offset,
                        raw: true,
                    });
                } else {
                    return await db.thread.findAll({
                        where: {
                            [Op.or]: {
                                threadID: { [Op.like]: '%' + searchTerm + '%' }, 
                                boardID: { [Op.like]: '%' + searchTerm + '%' },
                                threadName: { [Op.like]: '%' + searchTerm + '%' },
                                userID: { [Op.like]: '%' + searchTerm + '%' }
                            }
                        },
                        order: [
                            [sort, sortDirection],
                            ['threadName', 'ASC'],
                        ],
                        limit: limit,
                        raw: true,
                    });
                }
            } else {
                return await db.thread.findAll({
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
                        ['threadName', 'ASC'],
                    ],
                    raw: true,
                });
            }
        } else {
            if (pagination) {
                limit = searchCriteria.limit;
                if (page != 0) {
                    offset = page * limit;
                    return await db.thread.findAll({
                        order: [
                            [sort, sortDirection],
                            ['threadName', 'ASC'],
                        ],
                        limit: limit,
                        offset: offset,
                        raw: true,
                    });
                } else {
                    return await db.thread.findAll({
                        order: [
                            [sort, sortDirection],
                            ['threadName', 'ASC'],
                        ],
                        limit: limit,
                        raw: true,
                    });
                }
            } else {
                return await db.thread.findAll({
                    order: [
                        [sort, sortDirection],
                        ['threadName', 'ASC'],
                    ],
                    raw: true,
                });
            }
        }

    } catch (err) {
        console.log(err)
    }
}

async function create(thread){
    try{
        return await db.thread.create({
            threadID: thread.threadID,
            boardID: thread.boardID,
            userID: thread.userID,
            threadName: thread.threadName
        });
    } catch(err){
        console.log(err)
        if(err.errors[0].type === 'unique violation'){
            return err.errors[0].message;
        }
    }
}

async function getOne(threadID){
    try{
        return await db.thread.findOne({
            where: {threadID: threadID},
            raw: true
        });
    } catch(err){
        console.log(err);
    }
}

async function update(threadID, thread){
    try{
        return result = await db.thread.update(
            thread,
            {
                where:{
                    threadID: threadID
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

async function deleteThread(threadID) {
    try {
        return result = await db.thread.destroy({
            where: {
                threadID: threadID
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
    deleteThread,
    findCount
};