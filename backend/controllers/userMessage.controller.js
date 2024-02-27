const userMessageService = require('../services/userMessage.service');

// create userMessage
exports.create = async (req) => {
    try {
        return await userMessageService.createUserMessage(req);
    } catch(err) {
        console.error(err);
    }
};

// Get count of userMessages by searchCriteria
exports.findCount = async (searchCriteria) => {
    try {
        let userMessageCount = await userMessageService.findCount(searchCriteria);
        if( userMessageCount > 0) {
            return userMessageCount;
        } else {
            return { message: 'No data in user message table to fetch.'};
        }
    } catch(err) {
        console.error(err);
    }
};

// get all userMessages by searchCriteria
exports.findAll = async (searchCriteria) => {
    try {
        let allUserMessages = await userMessageService.findAll(searchCriteria);
        if( allUserMessages.length > 0) {
            return allUserMessages;
        } else {
            return { message: 'No data in user message table to fetch.'};
        }
    } catch(err) {
        console.error(err);
    }
};

// get all userMessages by userIDSentMessage and userIDReceivedMessage
exports.getUserMessagesBySentReceivedIDs = async (req) => {
    try {
        let userMessages = await userMessageService.getUserMessagesBySentReceivedIDs(req);
        if (userMessages == null || userMessages == undefined) {
            return 'Cannot find user messages with specified userIDs';
        } else {
            return userMessages;
        }
    } catch (err) {
        console.error(err);
    }
};

// get userMessage by userID
exports.findAllByUserID = async (userID) => {
    try {
        let allUserMessages = await userMessageService.findAllByUserID(userID);
        if (allUserMessages.length > 0) {
            return allUserMessages;
        } else {
            return { message: 'No data in user message table to fetch.'};
        }
    } catch (err) {
        console.error(err);
    }
};

// edit a userMessage by userMessageID
exports.update = async (userMessageID, userMessage) => {
    try {
        return await userMessageService.updateUserMessage(userMessageID, userMessage);
    } catch(err){
        console.error(err);
    }
};

// delete a userMessage by userMessageID
exports.delete = async (userMessageID) => {
    try {
        return await userMessageService.deleteUserMessage(userMessageID);
    } catch (err) {
        console.error(err);
    }
};