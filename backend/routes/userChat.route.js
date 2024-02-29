const express = require("express");
const router = express.Router();
const userChatController = require('../controllers/userChat.controller.js');

// create userChat
router.post('/addUserChat', async function (req, res){
    try {
        let newUserChat = await userChatController.create(req.body);
        if(typeof newUserChat === 'string'){
            res.status(403).send(newUserChat);
        } else {
            newUserChat = newUserChat['dataValues'];
            res.status(201).json({
                newUserChat: newUserChat
            });
        }
    } catch (err) {
        res.status(500).send("There was an error adding a userChat to the database.");
    }
});

// get all userChats
router.post('/allUserChats', async function (req, res){
    try {
        if(req.body != null){
            let searchCriteria = req.body;
            let allUserChats;
            let userChatCount;
            if(searchCriteria.pagination === 'true'){
                userChatCount = await userChatController.findCount(searchCriteria);
                if(userChatCount > 0){
                    searchCriteria.userChatCount = userChatCount;
                    allUserChats = await userChatController.findAll(searchCriteria);
                    if(allUserChats.message !== 'No data in user chat table to fetch.'){
                        searchCriteria.data = allUserChats;
                        return res.status(200).json(searchCriteria);
                    } else {
                        return res.status(200).send({message:'No data in user chat table to fetch.'})
                    }
                } else {
                    return res.status(200).send({message:'No data in user chat table to fetch.'})
                }
            } else {
                allUserChats = await userChatController.findAll(searchCriteria);
                userChatCount = allUserChats.length;
                if(allUserChats.message !== 'No data in user chat table to fetch.'){
                    searchCriteria.data = allUserChats;
                    return res.status(200).json(searchCriteria);
                } else {
                    return res.status(200).send({message:'No data in user chat table to fetch.'})
                }
            }
        } else {
            res.status(400).send('Search criteria is required.');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("There was an error fetching all the user chats from the database.");
    }
});

// get all userChats by userIDs
router.post('/getUserChatsByIDs', async function (req, res) {
    try {
        if(req.body !== undefined){
            let userIDOne = req.body.userIDOne;
            let userIDTwo = req.body.userIDTwo;
            if(userIDOne && userIDTwo){
                let userChats = await userChatController.getUserChatsByIDs({userIDOne,userIDTwo});
                if(userChats != undefined && typeof userChats !== 'string'){
                    res.status(200).send(userChats);
                } else {
                    res.status(200).json({
                        message: userChats
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
        res.status(500).send("There was an error fetching all user chats from the database based on two userIDs.");
    }
});

// edit a userChat by userID
router.put('/editUserChat', async function (req, res) {
    try {
        if(req.body.userChatID !== undefined){
            const userChatID = req.body.userChatID;
            let userChat = await userChatController.findOne(userChatID);
            if(userChat == undefined || typeof userChat === 'string'){
                return res.status(404).send(userChat);
            }
            
            ///update userChat
            let updatedUserChat = await userChatController.update(userChatID,req.body);
            if(typeof updatedUserChat === 'string'){
                return res.status(403).send(updatedUserChat);
            } else if(updatedUserChat[0] == 1){ 
                return res.status(200).json({
                    message: "The user chat was updated successfully.",
                    userChatID: updatedUserChat.userChatID
                });
            } else {
                return res.status(503).send('UserChat was not updated successfully.');
            }
        } else {
            return res.status(400).json({
                message:"The userChatID is required to update a user chat."
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("There was an error editing a userChat.");
    }
});

// delete a userChat by userID
router.delete('/deleteUserChat/:userChatID', async function (req, res) {
    try {
        if(req.params.userChatID !== undefined){
            let userChatID = Number(req.params.userChatID);
            let result = await userChatController.delete(userChatID);
            if(result == 1){
                res.status(200).json({
                    message:`UserChat with ID: ${userChatID} has been deleted successfully.`}
                );
            } else {
                res.status(503).send('UserChat was not deleted successfully.');
            }
        } else {
            res.status(400).send('UserChatID is required.');
        }
    } catch(err){
        console.error(err);
        res.status(500).send("There was an error deleting a userChat.");
    }
});

module.exports = router;