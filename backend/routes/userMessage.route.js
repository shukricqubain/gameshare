const express = require("express");
const router = express.Router();
const userMessageController = require('../controllers/userMessageController.js');
const db = require('../models/index');

// create userMessage
router.post('/addUserMessage', async function (req, res){

});

// get all userMessages
router.post('/allUserMessages', async function (req, res){

});

// get all userMessages by userIDSentMessage and userIDReceivedMessage
router.post('/getUserMessagesBySentReceivedIDs', async function (req, res) {

});

// get userMessage by userID
router.get('/getAllMessagesByUserID:userID', async function (req, res) {

});

// edit a userMessage by userID
router.put('/editUserMessage', async function (req, res) {

});

// delete a userMessage by userID
router.post('/deleteUserMessage:userMessageID', async function (req, res) {

});

module.exports = router;