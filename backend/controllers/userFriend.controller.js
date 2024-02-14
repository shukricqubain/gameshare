const userFriendService = require('../services/userFriend.service');

// Create and Save a new userFriend
exports.create = async (req) => {
    try {
        return await userFriendService.createUserFriend(req);
    } catch (err) {
        console.error(err);
    }
};

// Get count of userFriends by searchCriteria
exports.findCount = async (searchCriteria) => {
    try {
        let userFriendCount = await userFriendService.findCount(searchCriteria);
        if (userFriendCount > 0) {
            return userFriendCount;
        } else {
            return { message: 'No data in user friend table to fetch.' };
        }
    } catch (err) {
        console.error(err);
    }
};

// Get all userFriends by searchCriteria
exports.findAll = async (searchCriteria) => {
    try {
        let allUserFriends = await userFriendService.findAll(searchCriteria);
        if (allUserFriends.length > 0) {
            return allUserFriends;
        } else {
            return { message: 'No data in user friend table to fetch.' };
        }
    } catch (err) {
        console.error(err);
    }
}

// Get all userFriends by userID
exports.findAllByUserID = async (userID) => {
    try {
        let allUserFriends = await userFriendService.findAllByUserID(userID);
        if (allUserFriends.length > 0) {
            return allUserFriends;
        } else {
            return { message: 'No data in user friend table to fetch based on userID.' };
        }
    } catch (err) {
        console.error(err);
    }
}

// Get all userFriends by userFriendID
exports.findOne = async (req) => {
    try {
        let userFriend = await userFriendService.getOneUserFriend(req);
        if (userFriend == null || userFriend == undefined) {
            return 'Cannot find user friend with specified userFriendID';
        } else {
            return userFriend;
        }
    } catch (err) {
        console.error(err);
    }
};

// Get userFriends by sentUserID ReceivedUserID
exports.getUserSentAndUserReceivedIDs = async (req) => {
    try {
        let userFriend = await userFriendService.getUserSentAndUserReceivedID(req);
        if (userFriend == null || userFriend == undefined) {
            return 'Cannot find user friend with specified userIDSentRequest and userIDReceivedRequest';
        } else {
            return userFriend;
        }
    } catch (err) {
        console.error(err);
    }
};

//get mutual friends
exports.getMutualFriends = async (req) => {
    try {
        let userFriends = await userFriendService.getMutualFriends(req);
        if (userFriends == null || userFriends == undefined || userFriends.length == 0) {
            return 'Cannot find mutual friends between the two provided userIDs';
        } else {
            return userFriends;
        }
    } catch (err) {
        console.error(err);
    }
};

// Update a userFriend by their userFriendID
exports.update = async (userFriendID, userFriend) => {
    try {
        return await userFriendService.updateUserFriend(userFriendID, userFriend);
    } catch(err){
        console.error(err);
    }
}

// Delete a userFriend by their userFriendID
exports.delete = async (userFriendID) => {
    try {
        return await userFriendService.deleteUserFriend(userFriendID);
    } catch (err) {
        console.error(err);
    }
};
