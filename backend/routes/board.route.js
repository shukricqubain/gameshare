const express = require("express");
const router = express.Router();
const boardController = require("../controllers/board.controller");

// create a board
router.post('/addBoard', async function(req, res){
    try{
        ///create new board
        let newBoard = await boardController.create(req.body);
        if(typeof newBoard === 'string'){
            res.status(403).send(newBoard);
        } else {
            newBoard = newBoard['dataValues'];
            res.status(201).json({
                newBoard: newBoard
            });
        }
    } catch(err){
        res.status(500).json({
            message:"There was an error adding a board to the database.",
            err
        });
    }
});

// get all boards
router.post('/allBoards', async function(req, res) {
    try{
        if(req.body !== null){
            let searchCriteria = req.body;
            let allBoards;
            let boardCount;
            if(searchCriteria.pagination === 'true'){
                boardCount = await boardController.findCount(searchCriteria);
                if(boardCount > 0){
                    searchCriteria.boardCount = boardCount;
                    allBoards = await boardController.findAll(searchCriteria);
                    if(allBoards.message !== 'No data in board table to fetch.'){
                        searchCriteria.data = allBoards;
                        return res.status(200).json(searchCriteria);
                    } else {
                        return res.status(200).send({message:'No data in board table to fetch.'});
                    }
                } else {
                    return res.status(200).send({message:'No data in board table to fetch.'});
                }
            } else {
                allBoards = await boardController.findAll(searchCriteria);
                boardCount = allBoards.length;
                searchCriteria.boardCount = boardCount;
                if(allBoards.message !== 'No data in board table to fetch.'){
                    searchCriteria.data = allBoards;
                    return res.status(200).json(searchCriteria);
                } else {
                    return res.status(200).send({message:'No data in board table to fetch.'});
                }
            }
        } else {
            res.status(400).send('Search criteria is required.');
        }
    } catch(err){
        console.log(err)
    }
});

// get all boardNames in the database
router.get('/allBoardNames', async function(req, res){
    try{
        let allBoardNames = await boardController.findAllBoardNames();
        if(allBoardNames !== undefined && allBoardNames !== null){
            res.status(200).send(allBoardNames);
        } else {
            res.status(200).send(`No board names found in the database.`);
        }
    } catch(err){
        console.log(err);
        res.status(500).json({
            message:"There was an error getting all board names from the database.",
            err
        });
    }
});

// get a single board by their boardID
router.get('/singleBoard/:boardID', async function(req, res){
    try{
        if(req.params.boardID !== undefined){
            let boardID = Number(req.params.boardID);
            let board = await boardController.findOne(boardID);
            if(board !== undefined && typeof board !== 'string'){
                res.status(200).send(board);
            } else {
                res.status(404).send(board);
            }
        } else {
            res.status(400).send('boardID is required.');
        }
    } catch(err){
        console.log(err);
    }
});

// edit a board by boardID
router.put('/editBoard', async function(req, res){
    try{
        if(req.body.boardID !== undefined){
            const boardID = req.body.boardID;
            let board = await boardController.findOne(boardID);
            if(board == undefined || typeof board === 'string'){
                return res.status(404).send(board);
            }
            
            ///update board
            let updatedBoard = await boardController.update(boardID,req.body);
            if(typeof updatedBoard === 'string'){
                return res.status(403).send(updatedBoard);
            } else if(updatedBoard[0] == 1){ 
                return res.status(200).json({
                    message: "The board was updated successfully.",
                    boardID: updatedBoard.boardID
                });
            } else {
                return res.status(503).send('Board was not updated successfully.');
            }
        } else {
            return res.status(400).json({
                message:"The boardID is required to update a board."
            });
        }
    } catch(err){
        return res.status(500).json({
            message:"There was an error when trying to edit a board",
            err
        });
    }
});

// delete a board by boardID
router.delete('/deleteBoard/:boardID', async function(req, res){
    try{
        if(req.params.boardID !== undefined){
            let boardID = Number(req.params.boardID);
            let result = await boardController.delete(boardID);
            if(result == 1){
                res.status(200).json({
                    message:`Board with ID: ${boardID} has been deleted successfully.`}
                );
            } else {
                res.status(503).send('Board was not deleted successfully.');
            }
        } else {
            res.status(400).send('boardID is required.');
        }
    }catch(err){
        res.status(500).json({
            message:"There was an error when trying to delete a board.",
            err
        });
    }
});

module.exports = router;