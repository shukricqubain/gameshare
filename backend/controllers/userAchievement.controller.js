const userAchievementService = require('../services/userAchievement.service');

// Create and Save a new userAchievement
exports.create = async (req) => {
    try {
        let result = await userAchievementService.create(req);
        return result;
    } catch (err) {
        console.log(err)
    }
};

// Get count of all userAchievements
exports.findCount = async (searchCriteria) => {
    try {
        let userAchievementCount = await userAchievementService.findCount(searchCriteria);
        if (userAchievementCount > 0) {
            return userAchievementCount;
        } else {
            return { message: 'No data in user achievement table to fetch.' };
        }
    } catch (err) {
        console.log(err);
    }
};

// Get all userAchievements
exports.findAll = async (req, res) => {
    try {
        let alluserAchievements = await userAchievementService.getAll(req);
        if (alluserAchievements.length > 0) {
            return alluserAchievements;
        } else {
            return { message: 'No data in user achievement table to fetch.' };
        }
    } catch (err) {
        console.log(err);
    }
};

// Get all userAchievements by userID
exports.findAllByUserID = async (req, res) => {
    try {
        let alluserAchievements = await userAchievementService.getAllByUserID(req);
        if (alluserAchievements.length > 0) {
            return alluserAchievements;
        } else {
            return { message: 'No data in user achievement table to fetch.' };
        }
    } catch (err) {
        console.log(err);
    }
}

// Get all userAchievements by gameID
exports.findAllAchievementsByGameID = async (req, res) => {
    try {
        let alluserAchievements = await userAchievementService.getAllByGameID(req);
        if (alluserAchievements.length > 0) {
            return alluserAchievements;
        } else {
            return { message: 'No data in user achievement table to fetch.' };
        }
    } catch (err) {
        console.log(err);
    }
}

// Get single userAchievement by id
exports.findOne = async (req) => {
    try {
        let userAchievement = await userAchievementService.getOne(req);
        if (userAchievement == null) {
            return 'Cannot find user achievement with specified achievementID';
        } else {
            return userAchievement;
        }
    } catch (err) {
        console.log(err);
    }
};

// Update a userAchievement by their id
exports.update = async (userAchievementID, userAchievement) => {
    try {
        return await userAchievementService.update(userAchievementID, userAchievement);
    } catch (err) {
        console.log(err);
    }
};

// Delete a userAchievement by their id
exports.delete = async (userAchievementID) => {
    try {
        return await userAchievementService.deleteAchievement(userAchievementID);
    } catch (err) {
        console.log(err);
    }
};

// Bulk delete userAchievements by userID and gameID
exports.bulkDelete = async (userID, gameID) => {
    try {
        return await userAchievementService.bulkDelete(userID, gameID);
    } catch (err) {
        console.error(err);
    }
}

/// Retrieves the count of completed userAchievements based on achievementID
exports.getCompletedUserAchievementsRatio = async (achievementID) => {
    try {
        return await userAchievementService.getCompletedUserAchievementsRatio(achievementID);
    } catch (err) {
        console.error(err);
    }
}