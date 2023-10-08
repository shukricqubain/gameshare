const db = require('../models');
const boardService = require('../services/board.service');
const Board = db.board;
const Op = db.Sequelize.Op;

// Create and Save a new Board
exports.create = async (req, res) => {
    try{
        let result = await boardService.create(req);
        return result;
    } catch(err){
        console.log(err)
    }
};

// Get all boards
exports.findCount = async (searchCriteria) => {
    try{
        let boardCount = await boardService.findCount(searchCriteria);
        if(boardCount > 0){
            return boardCount;
        } else {
            return {message: 'No data in board table to fetch.'};
        }
    } catch(err){
        console.log(err);
    }
};

// Get all boards
exports.findAll = async (searchCriteria) => {
    try{
        let all_boards = await boardService.getAll(searchCriteria);
        if(all_boards.length > 0){
            return all_boards;
        } else {
            return {message: 'No data in board table to fetch.'};
        }
    } catch(err){
        console.log(err);
    }
};

// Get single board by id
exports.findOne = async (req) => {
    try{
        let board = await boardService.getOne(req);
        if(board == null){
            return 'Cannot find board with specified boardID';
        } else {
            return board;
        }
    } catch(err){
        console.log(err);
    }
};

// Get single board by boardName
exports.findUsername = async (boardName) => {
    try{
        let board = await boardService.getBoarByBoardName(boardName);
        if(board == null){
            return 'Cannot find board with specified boardName';
        } else {
            return board;
        }
    } catch(err){
        console.log(err);
    }
}

// Update a board by their id
exports.update = async (boardID, board) => {
    try{
        return await boardService.update(boardID, board);
    } catch(err){
        console.log(err);
    }
};

// Delete a board by their id
exports.delete = async (boardID) => {
    try{
        return await boardService.deleteUser(boardID);
    } catch(err){
        console.log(err);
    }
};