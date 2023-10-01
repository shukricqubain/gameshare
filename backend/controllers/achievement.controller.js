const achievementService = require('../services/achievement.service');

// Create and Save a new achievement
exports.create = async (req) => {
    try{
        let result = await achievementService.create(req);
        return result;
    } catch(err){
        console.log(err)
    }
};

// Get count of all achievements
exports.findCount = async (searchCriteria) => {
    try{
        let achievementCount = await achievementService.findCount(searchCriteria);
        if(achievementCount > 0){
            return achievementCount;
        } else {
            return {message: 'No data in achievement table to fetch.'};
        }
    } catch(err){
        console.log(err);
    }
};

// Get all achievements
exports.findAll = async (req, res) => {
    try{
        let allAchievements = await achievementService.getAll(req);
        if(allAchievements.length > 0){
            return allAchievements;
        } else {
            return {message: 'No data in achievement table to fetch.'};
        }
    } catch(err){
        console.log(err);
    }
};

// Get all achievement names
exports.findAllAchievementNames = async () => {
    try{
        let allAchievementNames = await achievementService.getAllAchievementNames();
        if(allAchievementNames.length > 0){
            return allAchievementNames;
        } else {
            return {message: 'No data in achievement table to fetch.'};
        }
    } catch(err){
        console.log(err);
    }
}

// Get single achievement by id
exports.findOne = async (req) => {
    try{
        let achievement = await achievementService.getOne(req);
        if(achievement == null){
            return 'Cannot find achievement with specified achievementID';
        } else {
            return achievement;
        }
    } catch(err){
        console.log(err);
    }
};

// Update a achievement by their id
exports.update = async (achievementID, achievement) => {
    try{
        return await achievementService.update(achievementID, achievement);
    } catch(err){
        console.log(err);
    }
};

// Delete a achievement by their id
exports.delete = async (achievementID) => {
    try{
        return await achievementService.deleteAchievement(achievementID);
    } catch(err){
        console.log(err);
    }
};