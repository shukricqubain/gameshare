const express = require("express");
const router = express.Router();
const userFriendController = require('../controllers/userFriend.controller.js');
const userController = require('../controllers/user.controller.js');
const db = require('../models/index');

// create a userFriend
router.post('/addUserFriend', async function (req, res) {
    try {
        let newUserFriend = await userFriendController.create(req.body);
        if(typeof newUserFriend === 'string'){
            res.status(403).send(newUserFriend);
        } else {
            newUserFriend = newUserFriend['dataValues'];
            res.status(201).json({
                newUserFriend: newUserFriend
            });
        }
    } catch (err) {
        res.status(500).send("There was an error adding a userFriend to the database.");
    }
});

// get all userFriends
router.post('/allUserFriends', async function (req, res) {
    try {
        if(req.body != null){
            let searchCriteria = req.body;
            let allUserFriends;
            let userFriendCount;
            if(searchCriteria.pagination === 'true'){
                userFriendCount = await userFriendController.findCount(searchCriteria);
                if(userFriendCount > 0){
                    searchCriteria.userFriendCount = userFriendCount;
                    allUserFriends = await userFriendController.findAll(searchCriteria);
                    if(allUserFriends.message !== 'No data in user friend table to fetch.'){
                        searchCriteria.data = allUserFriends;
                        return res.status(200).json(searchCriteria);
                    } else {
                        return res.status(200).send({message:'No data in user friend table to fetch.'})
                    }
                } else {
                    return res.status(200).send({message:'No data in user friend table to fetch.'})
                }
            } else {
                allUserFriends = await userFriendController.findAll(searchCriteria);
                userFriendCount = allUserFriends.length;
                if(allUserFriends.message !== 'No data in user friend table to fetch.'){
                    searchCriteria.data = allUserFriends;
                    return res.status(200).json(searchCriteria);
                } else {
                    return res.status(200).send({message:'No data in user friend table to fetch.'})
                }
            }
        } else {
            res.status(400).send('Search criteria is required.');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("There was an error fetching all the userFriends from the database.");
    }
});

// get all userFriends by userFriendID
router.get('/singleUserFriend/:userFriendID', async function (req, res) {
    try {
        if(req.params.userFriendID !== undefined){
            let userFriendID = Number(req.params.userFriendID);
            let userFriend = await userFriendController.findOne(userFriendID);
            if(userFriend != undefined && typeof userFriend !== 'string'){
                res.status(200).send(userFriend);
            } else {
                res.status(404).send(userFriend);
            }
        } else {
            res.status(400).send('userFriendID is required.');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("There was an error fetching a single userFriend from the database.");
    }
});

// get all userFriends by userID
router.get('/getAllByUserID/:userID', async function (req, res) {
    try {
        if(req.params.userID !== undefined){
            let userID = Number(req.params.userID);
            let userFriends = await userFriendController.findAllByUserID(userID);
            if(userFriends != undefined && typeof userFriends !== 'string'){
                res.status(200).send(userFriends);
            } else {
                res.status(404).send(userFriends);
            }
        } else {
            res.status(400).send('userID is required.');
        }
    } catch(err){
        console.error(err);
        res.status(500).send("There was an error fetching all userFriends from the database by userID.");
    }
});

// get all userFriends by userSentID and userReceivedIDs
router.post('/getByUserSentAndUserReceivedIDs', async function (req, res) {
    try {
        if(req.body !== undefined){
            let userIDOne = req.body.userIDOne;
            let userIDTwo = req.body.userIDTwo;
            if(userIDOne && userIDTwo){
                let userFriend = await userFriendController.getUserSentAndUserReceivedIDs({userIDOne,userIDTwo});
                if(userFriend != undefined && typeof userFriend !== 'string'){
                    res.status(200).send(userFriend);
                } else {
                    res.status(200).json({
                        message: userFriend
                    });
                }
            } else {
                res.status(400).send('The userIDSentRequest and userIDReceivedRequest are required.');
            }            
        } else {
            res.status(500).send('The request came in undefined.');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("There was an error fetching a single userFriend from the database.");
    }
});

// get all mutual friends between two users
router.post('/getMutualFriends', async function (req, res){
    try {
        if(req.body !== undefined){
            let userIDOne = req.body.userIDOne;
            let userIDTwo = req.body.userIDTwo;
            if(userIDOne && userIDTwo){
                
                //get all mutual friend ids
                let userFriends = await userFriendController.getMutualFriends({userIDOne,userIDTwo});
                if(userFriends != undefined && userFriends.length > 0 && typeof userFriends !== 'string'){
                    //get all profilePictures and userNames based on ids
                    let mutualFriendData = await userController.getAllProfilePicturesByIDs(userFriends);
                    if(mutualFriendData != undefined && mutualFriendData.length > 0){
                        res.status(200).send(mutualFriendData);
                    } else if(mutualFriendData != undefined && mutualFriendData.length == 0) { 
                        res.status(200).send('No mutual friend data.')
                    } else {
                        res.status(500).send('Error finding mutual friend data.');
                    }
                    
                } else if(typeof userFriends === 'string' && userFriends === 'Cannot find mutual friends between the two provided userIDs') {
                    res.status(200).json({
                        message: 'No mutual friends.'
                    });
                } else {
                    res.status(200).json({
                        message: 'Error loading mutual friends.'
                    });
                }
            } else {
                res.status(400).send('Two userIDs are required.');
            }            
        } else {
            res.status(500).send('The request came in undefined.');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("There was an error fetching mutual friends from the database.");
    }
});

// edit a userFriend by userID
router.put('/editUserFriend', async function (req, res) {
    try {
        if(req.body.userFriendID !== undefined){
            const userFriendID = req.body.userFriendID;
            let userFriend = await userFriendController.findOne(userFriendID);
            if(userFriend == undefined || typeof userFriend === 'string'){
                return res.status(404).send(userBoard);
            }
            
            ///update userFriend
            let updatedUserFriend = await userFriendController.update(userFriendID,req.body);
            if(typeof updatedUserFriend === 'string'){
                return res.status(403).send(updatedUserFriend);
            } else if(updatedUserFriend[0] == 1){ 
                return res.status(200).json({
                    message: "The userFriend was updated successfully.",
                    userFriendID: updatedUserFriend.userFriendID
                });
            } else {
                return res.status(503).send('UserFriend was not updated successfully.');
            }
        } else {
            return res.status(400).json({
                message:"The userFriendID is required to update a userFriend."
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("There was an error editing a userFriend.");
    }
});

// delete a userFriend by userID
router.delete('/deleteUserFriend/:userFriendID', async function (req, res){
    try {
        if(req.params.userFriendID !== undefined){
            let userFriendID = Number(req.params.userFriendID);
            let result = await userFriendController.delete(userFriendID);
            if(result == 1){
                res.status(200).json({
                    message:`UserFriend with ID: ${userFriendID} has been deleted successfully.`}
                );
            } else {
                res.status(503).send('UserFriend was not deleted successfully.');
            }
        } else {
            res.status(400).send('UserFriendID is required.');
        }
    } catch(err){
        console.error(err);
        res.status(500).send("There was an error deleting a userFriend.");
    }
});

module.exports = router;