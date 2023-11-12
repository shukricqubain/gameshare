const db = require('../models/index');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

async function findCount(searchCriteria) {
    try {
        let sort = searchCriteria.sort;
        let sortDirection = searchCriteria.direction;
        let searchTerm = searchCriteria.searchTerm;
        let threadItems;
        if (searchTerm !== '') {
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
        } else {
            where = '';
        }
        threadItems = await db.threadItem.findAll({
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
        } else {
            where = '';
        }
        if (pagination) {
            limit = searchCriteria.limit;
            if (page != 0) {
                offset = page * limit;
            }
        }
        return await db.threadItem.findAll({
            where: where,
            order: [
                [sort, sortDirection],
                ['threadItemID', 'ASC'],
            ],
            limit: limit,
            offset: offset,
            raw: true,
        });
    } catch (err) {
        console.log(err)
    }
}

async function create(threadItem){
    try{
        return await db.threadItem.create({
            threadItemID: threadItem.threadItemID,
            threadID: threadItem.threadID,
            threadMessage: threadItem.threadMessage,
            userID: threadItem.userID
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
        return await db.threadItem.findOne({
            where: {threadItemID: threadItemID},
            raw: true
        });
    } catch(err){
        console.log(err);
    }
}

async function update(threadItemID, threadItem){
    try{
        return result = await db.threadItem.update(
            threadItem,
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
        return result = await db.threadItem.destroy({
            where: {
                threadItemID: threadItemID
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
    deleteThreadItem,
    findCount
};