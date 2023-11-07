const db = require('../models');
const threadService = require('../services/thread.service');
const Thread = db.thread;
const Op = db.Sequelize.Op;

// Create and Save a new Thread
exports.create = async (req, res) => {
    try{
        let result = await threadService.create(req);
        return result;
    } catch(err){
        console.log(err)
    }
};

// Get all Threads
exports.findCount = async (searchCriteria) => {
    try{
        let threadCount = await threadService.findCount(searchCriteria);
        if(threadCount > 0){
            return threadCount;
        } else {
            return {message: 'No data in thread table to fetch.'};
        }
    } catch(err){
        console.log(err);
    }
};

// Find count of threads for a specific boardID
exports.findCountByBoardID = async (searchCriteria) => {
    try{
        let threadCount = await threadService.findCountByBoardID(searchCriteria);
        if(threadCount > 0){
            return threadCount;
        } else {
            return {message: 'No data in thread table to fetch.'};
        }
    } catch(err){
        console.log(err);
    }
};

// Get all Threads
exports.findAll = async (searchCriteria) => {
    try{
        let allThreads = await threadService.getAll(searchCriteria);
        if(allThreads.length > 0){
            return allThreads;
        } else {
            return {message: 'No data in thread table to fetch.'};
        }
    } catch(err){
        console.log(err);
    }
};

// Get all Threads by boardID
exports.findAllByBoardID = async (searchCriteria) => {
    try{
        let allThreads = await threadService.getAllByBoardID(searchCriteria);
        if(allThreads.length > 0){
            return allThreads;
        } else {
            return {message: 'No data in thread table to fetch.'};
        }
    } catch(err){
        console.log(err);
    }
};

// Get single thread by id
exports.findOne = async (req) => {
    try{
        let thread = await threadService.getOne(req);
        if(thread == null){
            return 'Cannot find thread with specified threadID';
        } else {
            return thread;
        }
    } catch(err){
        console.log(err);
    }
};

// Update a thread by their id
exports.update = async (threadID, thread) => {
    try{
        return await threadService.update(threadID, thread);
    } catch(err){
        console.log(err);
    }
};

// Delete a thread by their id
exports.delete = async (threadID) => {
    try{
        return await threadService.deleteThread(threadID);
    } catch(err){
        console.log(err);
    }
};