const db = require('../models');
const userThreadService = require('../services/userThread.service');
const UserThread = db.userThread;
const Op = db.Sequelize.Op;

// Create and Save a new userThread
exports.create = async (req, res) => {
    try{
        let result = await userThreadService.create(req);
        return result;
    } catch(err){
        console.log(err)
    }
};

// Get all userThreads
exports.findCount = async (searchCriteria) => {
    try{
        let userThreadCount = await userThreadService.findCount(searchCriteria);
        if(userThreadCount > 0){
            return userThreadCount;
        } else {
            return {message: 'No data in userThread table to fetch.'};
        }
    } catch(err){
        console.log(err);
    }
};

// Get all userThreads
exports.findAll = async (searchCriteria) => {
    try{
        let allUserThreads = await userThreadService.getAll(searchCriteria);
        if(allUserThreads.length > 0){
            return allUserThreads;
        } else {
            return {message: 'No data in userThread table to fetch.'};
        }
    } catch(err){
        console.log(err);
    }
};

// Get single userThread by id
exports.findOne = async (req) => {
    try{
        let userThread = await userThreadService.getOne(req);
        if(userThread == null){
            return 'Cannot find userThread with specified userThreadID';
        } else {
            return userThread;
        }
    } catch(err){
        console.log(err);
    }
};

// Update a userThread by their id
exports.update = async (userThreadID, userThread) => {
    try{
        return await userThreadService.update(userThreadID, userThread);
    } catch(err){
        console.log(err);
    }
};

// Delete a userThread by their id
exports.delete = async (userThreadID) => {
    try{
        return await userThreadService.deleteUserThread(userThreadID);
    } catch(err){
        console.log(err);
    }
};