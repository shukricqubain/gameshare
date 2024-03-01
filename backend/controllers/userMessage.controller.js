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
            return [];
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
            return [];
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
            return [];
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
            return [];
        }
    } catch (err) {
        console.error(err);
    }
};

// get userMessages by userChatID
exports.findAllByUserChatID = async (userChatID) => {
    try {
        let allUserMessages = await userMessageService.findAllByUserChatID(userChatID);
        if (allUserMessages.length > 0) {
            return allUserMessages;
        } else {
            return [];
        }
    } catch (err) {
        console.error(err);
    }
};

exports.findMultiple = async (idString) => {
    try {
        let allUserMessages = await userMessageService.findMultiple(idString);
        if (allUserMessages.length > 0) {
            return allUserMessages;
        } else {
            return [];
        }
    } catch (err) {
        console.error(err);
    }
};

exports.updateReadReceipts = async (idString) => {
    try {
        return await userMessageService.updateReadReceipts(idString);
    } catch (err) {
        console.error(err);
    }
};

exports.findOne = async (userMessageID) => {
    try {
        let userMessage = await userMessageService.findOne(userMessageID);
        if (userMessage) {
            return userMessage;
        } else {
            return {message: 'No userMessage found with provided userMessageID.'};
        }
    } catch (err) {
        console.error(err);
    }
};

// edit a userMessage by userMessageID
exports.update = async (userMessageID, updateUserMessage) => {
    try {
        return await userMessageService.updateUserMessage(userMessageID, updateUserMessage);
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