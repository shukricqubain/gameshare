const userChatService = require('../services/userChat.service');

// create userChat
exports.create = async (req) => {
    try {
        return await userChatService.createUserChat(req);
    } catch(err) {
        console.error(err);
    }
};

// Get count of userChats by searchCriteria
exports.findCount = async (searchCriteria) => {
    try {
        let userChatCount = await userChatService.findCount(searchCriteria);
        if( userChatCount > 0) {
            return userChatCount;
        } else {
            return { message: 'No data in user chat table to fetch.'};
        }
    } catch(err) {
        console.error(err);
    }
};

// get all userChats by searchCriteria
exports.findAll = async (searchCriteria) => {
    try {
        let allUserChats = await userChatService.findAll(searchCriteria);
        if( allUserChats.length > 0) {
            return allUserChats;
        } else {
            return { message: 'No data in user chat table to fetch.'};
        }
    } catch(err) {
        console.error(err);
    }
};

// get all userChats by userID
exports.findAllByUserID = async (userID) => {
    try {
        let allUserChats = await userChatService.findAllByUserID(userID);
        if( allUserChats.length > 0) {
            return allUserChats;
        } else {
            return { message: 'No user chats found for the provided userID.'};
        }
    } catch(err) {
        console.error(err);
    }
};

// get one userChat by userChatID
exports.findOne = async (userChatID) => {
    try {
        let userChat = await userChatService.findOne(userChatID);
        if( userChat) {
            return userChat;
        } else {
            return { message: 'No user chat found with provided userChatID.'};
        }
    } catch(err) {
        console.error(err);
    }
};

// get all userChats by userIDs
exports.getUserChatsByIDs = async (req) => {
    try {
        let userChats = await userChatService.getUserChatsByIDs(req);
        if (userChats == null || userChats == undefined) {
            return 'Cannot find user chats with specified userIDs';
        } else {
            return userChats;
        }
    } catch (err) {
        console.error(err);
    }
};

// edit a userChat by userChatID
exports.update = async (userChatID, userChat) => {
    try {
        return await userChatService.updateUserChat(userChatID, userChat);
    } catch(err){
        console.error(err);
    }
};

// delete a userChat by userChatID
exports.delete = async (userChatID) => {
    try {
        return await userChatService.deleteUserChat(userChatID);
    } catch (err) {
        console.error(err);
    }
};