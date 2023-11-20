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
        ///sort thread items so replies appear properly
        let replyPosts = allThreadItems.filter(item => {
            return item.replyID !== null && item.replyID !== undefined;
        })
        for(let reply of replyPosts){
            ///get current index of reply
            const index = allThreadItems.map(i => i.threadItemID).indexOf(reply.threadItemID);
            ///get future index of reply
            const futureIndex = allThreadItems.map(i => i.threadItemID).indexOf(reply.replyID);
            ///check if the reply is already in an ideal position
            if(index != (futureIndex + 1)){
                ///remove reply from list
                allThreadItems.splice(index, 1);
                ///move reply to new position
                allThreadItems.splice(futureIndex + 1, 0, reply);
            }
        }
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