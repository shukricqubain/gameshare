const express = require("express");
const router = express.Router();
const userBoardController = require("../controllers/userBoard.controller");

// create a userBoard
router.post('/addUserBoard', async function(req, res){
    try{
        ///create new userboard
        let newUserBoard = await userBoardController.create(req.body);
        if(typeof newUserBoard === 'string'){
            res.status(403).send(newBoard);
        } else {
            newUserBoard = newUserBoard['dataValues'];
            res.status(201).json({
                newUserBoard: newUserBoard
            });
        }
    } catch(err){
        res.status(500).json({
            message:"There was an error adding a userBoard to the database.",
            err
        });
    }
});

// get all userboards
router.post('/allUserBoards', async function(req, res) {
    try{
        if(req.body !== null){
            let searchCriteria = req.body;
            let allUserBoards;
            let userBoardCount;
            if(searchCriteria.pagination === 'true'){
                userBoardCount = await userBoardController.findCount(searchCriteria);
                if(userBoardCount > 0){
                    searchCriteria.userBoardCount = userBoardCount;
                    allUserBoards = await userBoardController.findAll(searchCriteria);
                    if(allUserBoards.message !== 'No data in userBoard table to fetch.'){
                        searchCriteria.data = allUserBoards;
                        return res.status(200).json(searchCriteria);
                    } else {
                        return res.status(200).send({message:'No data in userBoard table to fetch.'});
                    }
                } else {
                    return res.status(200).send({message:'No data in userBoard table to fetch.'});
                }
            } else {
                allUserBoards = await userBoardController.findAll(searchCriteria);
                userBoardCount = allUserBoards.length;
                if(allUserBoards.message !== 'No data in userBoard table to fetch.'){
                    searchCriteria.data = allUserBoards;
                    return res.status(200).json(searchCriteria);
                } else {
                    return res.status(200).send({message:'No data in userBoard table to fetch.'});
                }
            }
        } else {
            res.status(400).send('Search criteria is required.');
        }
    } catch(err){
        console.log(err)
    }
});

// get a single userBoard by their userBoardID
router.get('/singleUserBoard/:userBoardID', async function(req, res){
    try{
        if(req.params.userBoardID !== undefined){
            let userBoardID = Number(req.params.userBoardID);
            let userBoard = await userBoardController.findOne(userBoardID);
            if(userBoard !== undefined && typeof userBoard !== 'string'){
                res.status(200).send(userBoard);
            } else {
                res.status(404).send(userBoard);
            }
        } else {
            res.status(400).send('userBoardID is required.');
        }
    } catch(err){
        console.log(err);
    }
});

// edit a userBoard by userBoardID
router.put('/editUserBoard', async function(req, res){
    try{
        if(req.body.userBoardID !== undefined){
            const userBoardID = req.body.userBoardID;
            let userBoard = await userBoardController.findOne(userBoardID);
            if(userBoard == undefined || typeof userBoard === 'string'){
                return res.status(404).send(userBoard);
            }
            
            ///update userBoard
            let updatedUserBoard = await userBoardController.update(userBoardID,req.body);
            if(typeof updatedUserBoard === 'string'){
                return res.status(403).send(updatedUserBoard);
            } else if(updatedUserBoard[0] == 1){ 
                return res.status(200).json({
                    message: "The userBoard was updated successfully.",
                    userBoardID: updatedUserBoard.userBoardID
                });
            } else {
                return res.status(503).send('UserBoard was not updated successfully.');
            }
        } else {
            return res.status(400).json({
                message:"The userBoardID is required to update a userBoard."
            });
        }
    } catch(err){
        return res.status(500).json({
            message:"There was an error when trying to edit a userBoard",
            err
        });
    }
});

// delete a userBoard by userBoardID
router.delete('/deleteUserBoard/:userBoardID', async function(req, res){
    try{
        if(req.params.userBoardID !== undefined){
            let userBoardID = Number(req.params.userBoardID);
            let result = await userBoardController.delete(userBoardID);
            if(result == 1){
                res.status(200).json({
                    message:`UserBoard with ID: ${userBoardID} has been deleted successfully.`}
                );
            } else {
                res.status(503).send('UserBoard was not deleted successfully.');
            }
        } else {
            res.status(400).send('UserBoardID is required.');
        }
    }catch(err){
        res.status(500).json({
            message:"There was an error when trying to delete a userBoard.",
            err
        });
    }
});

module.exports = router;