const userBoardService = require('../services/userBoard.service');

// Create and Save a new userBoard
exports.create = async (req, res) => {
    try{
        let result = await userBoardService.create(req);
        return result;
    } catch(err){
        console.log(err)
    }
};

// Get all userBoards
exports.findCount = async (searchCriteria) => {
    try{
        let userBoardCount = await userBoardService.findCount(searchCriteria);
        if(userBoardCount > 0){
            return userBoardCount;
        } else {
            return {message: 'No data in userBoard table to fetch.'};
        }
    } catch(err){
        console.log(err);
    }
};

// Get all userBoards
exports.findAll = async (searchCriteria) => {
    try{
        let allUserBoards = await userBoardService.getAll(searchCriteria);
        if(allUserBoards.length > 0){
            return allUserBoards;
        } else {
            return {message: 'No data in userBoard table to fetch.'};
        }
    } catch(err){
        console.log(err);
    }
};

// Get single userBoard by userBoardID
exports.findOne = async (req) => {
    try{
        let userBoard = await userBoardService.getOne(req);
        if(userBoard == null){
            return 'Cannot find userBoard with specified boardID';
        } else {
            return userBoard;
        }
    } catch(err){
        console.log(err);
    }
};

// Update a userBoard by their userBoardID
exports.update = async (userBoardID, userBoard) => {
    try{
        return await userBoardService.update(userBoardID, userBoard);
    } catch(err){
        console.log(err);
    }
};

// Delete a userBoard by their userBoardID
exports.delete = async (userBoardID) => {
    try{
        return await userBoardService.deleteUserBoard(userBoardID);
    } catch(err){
        console.log(err);
    }
};