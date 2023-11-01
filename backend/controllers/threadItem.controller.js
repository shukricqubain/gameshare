const db = require('../models');
const threadItemService = require('../services/threadItem.service');
const ThreadItem = db.threadItem;
const Op = db.Sequelize.Op;

// Create and Save a new ThreadItem
exports.create = async (req, res) => {
    try{
        let result = await threadItemService.create(req);
        return result;
    } catch(err){
        console.log(err)
    }
};

// Get all ThreadItems
exports.findCount = async (searchCriteria) => {
    try{
        let threadItemCount = await threadItemService.findCount(searchCriteria);
        if(threadItemCount > 0){
            return threadItemCount;
        } else {
            return {message: 'No data in thread table to fetch.'};
        }
    } catch(err){
        console.log(err);
    }
};

// Get all ThreadItems
exports.findAll = async (searchCriteria) => {
    try{
        let allThreadItems = await threadItemService.getAll(searchCriteria);
        if(allThreadItems.length > 0){
            return allThreadItems;
        } else {
            return {message: 'No data in threadItem table to fetch.'};
        }
    } catch(err){
        console.log(err);
    }
};

// Get single threadItem by id
exports.findOne = async (req) => {
    try{
        let threadItem = await threadItemService.getOne(req);
        if(threadItem == null){
            return 'Cannot find thread with specified threadItemID';
        } else {
            return threadItem;
        }
    } catch(err){
        console.log(err);
    }
};

// Update a threadItem by their id
exports.update = async (threadItemID, threadItem) => {
    try{
        return await threadItemService.update(threadItemID, threadItem);
    } catch(err){
        console.log(err);
    }
};

// Delete a threadItem by their id
exports.delete = async (threadItemID) => {
    try{
        return await threadItemService.deleteThreadItem(threadItemID);
    } catch(err){
        console.log(err);
    }
};