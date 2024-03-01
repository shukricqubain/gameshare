const express = require("express");
const router = express.Router();
const userMessageController = require('../controllers/userMessage.controller.js');
const db = require('../models/index');

// create userMessage
router.post('/addUserMessage', async function (req, res) {
    try {
        let newUserMessage = await userMessageController.create(req.body);
        if (typeof newUserMessage === 'string') {
            res.status(403).send(newUserMessage);
        } else {
            newUserMessage = newUserMessage['dataValues'];
            res.status(201).json({
                newUserMessage: newUserMessage
            });
        }
    } catch (err) {
        res.status(500).send("There was an error adding a userMessage to the database.");
    }
});

// get all userMessages
router.post('/allUserMessages', async function (req, res) {
    try {
        if (req.body != null) {
            let searchCriteria = req.body;
            let allUserMessages;
            let userMessageCount;
            if (searchCriteria.pagination === 'true') {
                userMessageCount = await userMessageController.findCount(searchCriteria);
                if (userMessageCount > 0) {
                    searchCriteria.userMessageCount = userMessageCount;
                    allUserMessages = await userMessageController.findAll(searchCriteria);
                    if (allUserMessages.message !== 'No data in user message table to fetch.') {
                        searchCriteria.data = allUserMessages;
                        return res.status(200).json(searchCriteria);
                    } else {
                        return res.status(200).send({ message: 'No data in user message table to fetch.' })
                    }
                } else {
                    return res.status(200).send({ message: 'No data in user message table to fetch.' })
                }
            } else {
                allUserMessages = await userMessageController.findAll(searchCriteria);
                userMessageCount = allUserMessages.length;
                if (allUserMessages.message !== 'No data in user message table to fetch.') {
                    searchCriteria.data = allUserFriends;
                    return res.status(200).json(searchCriteria);
                } else {
                    return res.status(200).send({ message: 'No data in user message table to fetch.' })
                }
            }
        } else {
            res.status(400).send('Search criteria is required.');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("There was an error fetching all the userMessages from the database.");
    }
});

// get all userMessages by userIDSentMessage and userIDReceivedMessage
router.post('/getUserMessagesBySentReceivedIDs', async function (req, res) {
    try {
        if (req.body !== undefined) {
            let userIDOne = req.body.userIDOne;
            let userIDTwo = req.body.userIDTwo;
            if (userIDOne && userIDTwo) {
                let userMessage = await userMessageController.getUserMessagesBySentReceivedIDs({ userIDOne, userIDTwo });
                if (userMessage != undefined && typeof userMessage !== 'string') {
                    res.status(200).send(userMessage);
                } else {
                    res.status(200).json({
                        message: userMessage
                    });
                }
            } else {
                res.status(400).send('The userIDSentMessage and userIDReceivedMessage are required.');
            }
        } else {
            res.status(500).send('The request came in undefined.');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("There was an error fetching all userMessages from the database based on two userIDs.");
    }
});

// get userMessage by userID
router.get('/getAllMessagesByUserID/:userID', async function (req, res) {
    try {
        if (req.params.userID !== undefined) {
            let userID = Number(req.params.userID);
            let userMessages = await userMessageController.findAllByUserID(userID);
            if (userMessages != undefined && typeof userMessages !== 'string') {
                res.status(200).send(userMessages);
            } else {
                res.status(404).send(userMessages);
            }
        } else {
            res.status(400).send('userID is required.');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("There was an error fetching all userMessages from the database by userID.");
    }
});

// get all userMessages by userChatID
router.get('/getAllByUserChatID/:userChatID', async function (req, res) {
    try {
        if (req.params.userChatID !== undefined) {
            let userChatID = Number(req.params.userChatID);
            let userMessages = await userMessageController.findAllByUserChatID(userChatID);
            if (userMessages != undefined && typeof userMessages !== 'string') {
                res.status(200).send(userMessages);
            } else {
                res.status(200).send(userMessages);
            }
        } else {
            res.status(400).send('userChatID is required.');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("There was an error fetching all userMessages from the database by userChatID.");
    }
});

// edit a userMessage by userID
router.put('/editUserMessage', async function (req, res) {
    try {
        if (req.body.userMessageID !== undefined) {
            const userMessageID = req.body.userMessageID;
            let userMessage = await userMessageController.findOne(userMessageID);
            if (userMessage == undefined || typeof userMessage === 'string') {
                return res.status(404).send(userMessage);
            }

            ///update userMessage
            let updatedUserMessage = await userMessageController.update(userMessageID, req.body);
            if (typeof updatedUserMessage === 'string') {
                return res.status(403).send(updatedUserMessage);
            } else if (updatedUserMessage[0] == 1) {
                return res.status(200).json({
                    message: "The userMessage was updated successfully.",
                    userMessageID: updatedUserMessage.userMessageID
                });
            } else {
                return res.status(503).send('UserMessage was not updated successfully.');
            }
        } else {
            return res.status(400).json({
                message: "The userMessageID is required to update a userMessage."
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("There was an error editing a userMessage.");
    }
});

// update userMessages to show they've been read
router.put('/updateReadReceipts', async function (req, res) {
    try {
        if (req.body !== undefined) {
            const updateString = req.body.updateString;
            let userMessages = await userMessageController.findMultiple(updateString);
            let updateCount = userMessages.length;
            if (userMessages == undefined || typeof userMessages === 'string') {
                return res.status(404).send(userMessages);
            } else {
                let updateReadReceipts = await userMessageController.updateReadReceipts(updateString);
                if (typeof updateReadReceipts === 'string') {
                    return res.status(403).send(updateReadReceipts);
                } else if (updateReadReceipts && updateReadReceipts[0] == updateCount) {
                    return res.status(200).json({
                        message: "The read receipts were updated successfully.",
                    });
                } else if(updateReadReceipts && updateReadReceipts[0] < updateCount) {
                    return res.status(503).send('Not all read receipts were updated successfully.');
                } else {
                    return res.status(503).send('Read receipts were not updated successfully.');
                }
            }
        } else {
            return res.status(400).json({
                message: "The updateString is required to update read receipts."
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("There was an error updating read receipts.");
    }
});

// delete a userMessage by userID
router.delete('/deleteUserMessage/:userMessageID', async function (req, res) {
    try {
        if (req.params.userMessageID !== undefined) {
            let userMessageID = Number(req.params.userMessageID);
            let result = await userMessageController.delete(userMessageID);
            if (result == 1) {
                res.status(200).json({
                    message: `UserMessage with ID: ${userMessageID} has been deleted successfully.`
                }
                );
            } else {
                res.status(503).send('UserMessage was not deleted successfully.');
            }
        } else {
            res.status(400).send('UserMessageID is required.');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("There was an error deleting a userMessage.");
    }
});

module.exports = router;