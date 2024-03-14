const db = require('../models/index');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const threadItem = db.threadItem;
const thread = db.thread;

thread.hasMany(threadItem, {
    foreignKey: 'threadID'
});
threadItem.belongsTo(thread,{
    foreignKey: 'threadID'
});

async function findCount(searchCriteria) {
    try {
        let sort = searchCriteria.sort;
        let sortDirection = searchCriteria.direction;
        let searchTerm = searchCriteria.searchTerm;
        let threadItems;
        if (searchTerm !== '') {
            if(searchCriteria.threadID !== undefined && searchCriteria.threadID !== null){
                where = {
                    [Op.and]: {
                        [Op.or]: {
                            threadItemID: { [Op.like]: '%' + searchTerm + '%' }, 
                            threadMessage: { [Op.like]: '%' + searchTerm + '%' }, 
                            userID: { [Op.like]: '%' + searchTerm + '%' },
                            createdAt: { [Op.like]: '%' + searchTerm + '%' },
                            updatedAt: { [Op.like]: '%' + searchTerm + '%' }   
                        },
                        threadID: searchCriteria.threadID
                    }
                };
            } else {
                where = {
                    [Op.or]: {
                        threadItemID: { [Op.like]: '%' + searchTerm + '%' }, 
                        threadID: { [Op.like]: '%' + searchTerm + '%' }, 
                        threadMessage: { [Op.like]: '%' + searchTerm + '%' }, 
                        userID: { [Op.like]: '%' + searchTerm + '%' },
                        createdAt: { [Op.like]: '%' + searchTerm + '%' },
                        updatedAt: { [Op.like]: '%' + searchTerm + '%' }   
                    }
                };
            }
        } else {
            if(searchCriteria.threadID !== undefined && searchCriteria.threadID !== null){
                where = {
                    threadID: searchCriteria.threadID
                };
            } else {
                where = '';
            }
        }
        threadItems = await threadItem.findAll({
            where: where,
            order: [
                [sort, sortDirection],
                ['threadItemID', 'ASC'],
            ],
            attributes: ['threadItemID'],
            raw: true,
        });
        return threadItems.length;
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
            if(searchCriteria.threadID !== undefined && searchCriteria.threadID !== null){
                where = {
                    [Op.and]: {
                        [Op.or]: {
                            threadItemID: { [Op.like]: '%' + searchTerm + '%' }, 
                            threadID: { [Op.like]: '%' + searchTerm + '%' }, 
                            threadMessage: { [Op.like]: '%' + searchTerm + '%' }, 
                            userID: { [Op.like]: '%' + searchTerm + '%' },
                            createdAt: { [Op.like]: '%' + searchTerm + '%' },
                            updatedAt: { [Op.like]: '%' + searchTerm + '%' }   
                        },
                        threadID: searchCriteria.threadID
                    }
                };
            } else {
                where = {
                    [Op.or]: {
                        threadItemID: { [Op.like]: '%' + searchTerm + '%' }, 
                        threadID: { [Op.like]: '%' + searchTerm + '%' }, 
                        threadMessage: { [Op.like]: '%' + searchTerm + '%' }, 
                        userID: { [Op.like]: '%' + searchTerm + '%' },
                        createdAt: { [Op.like]: '%' + searchTerm + '%' },
                        updatedAt: { [Op.like]: '%' + searchTerm + '%' }   
                    },
                };
            }
            
        } else {
            if(searchCriteria.threadID !== undefined && searchCriteria.threadID !== null){
                where = {
                    threadID: searchCriteria.threadID
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
            return await threadItem.findAll({
                where: where,
                order: [
                    [sort, sortDirection],
                    ['threadItemID', 'ASC'],
                ],
                limit: limit,
                offset: offset,
                raw: true,
            });
        } else {
            return await threadItem.findAll({
                where: where,
                order: [
                    [sort, sortDirection],
                    ['threadItemID', 'ASC'],
                ],
                raw: true,
            });
        }
    } catch (err) {
        console.log(err)
    }
}

async function create(newThreadItem){
    try{
        return await threadItem.create({
            threadItemID: newThreadItem.threadItemID,
            threadID: newThreadItem.threadID,
            threadMessage: newThreadItem.threadMessage,
            userID: newThreadItem.userID,
            replyID: newThreadItem.replyID,
            threadItemImage: newThreadItem.threadItemImage
        });
    } catch(err){
        console.log(err)
        if(err.errors[0].type === 'unique violation'){
            return err.errors[0].message;
        }
    }
}

async function getOne(threadItemID){
    try{
        return await threadItem.findOne({
            where: {threadItemID: threadItemID},
            raw: true
        });
    } catch(err){
        console.log(err);
    }
}

async function update(threadItemID, updateThreadItem){
    try{
        return result = await threadItem.update(
            updateThreadItem,
            {
                where:{
                    threadItemID: threadItemID
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

async function deleteThreadItem(threadItemID) {
    try {
        return result = await threadItem.destroy({
            where: {
                threadItemID: threadItemID
            }
        });
    } catch (err) {
        console.error(err);
    }
}

async function findThreadItemHighlights(userID){
    try {
        return await threadItem.findAll({
            attributes: [
                "threadID",
                "threadMessage",
                "threadItemImage",
                "createdAt",
                "updatedAt",
                [Sequelize.col("thread.threadName"), "threadName"],
                [Sequelize.col("thread.boardName"), "boardName"],
            ],
            include: [
                {
                    model: thread
                },
            ],
            where: { 
                userID: userID,
            },
            raw: true
        });
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    getAll,
    getOne,
    create,
    update,
    deleteThreadItem,
    findCount,
    findThreadItemHighlights
};