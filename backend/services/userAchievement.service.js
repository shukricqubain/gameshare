const db = require('../models/index');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
const userAchievement = db.userAchievement;
const achievement = db.achievement;

achievement.hasMany(userAchievement, {
    foreignKey: 'achievementID'
});
userAchievement.belongsTo(achievement,{
    foreignKey: 'achievementID'
});

async function findCount(searchCriteria) {
    try {
        let sort = searchCriteria.sort;
        let sortDirection = searchCriteria.direction;
        let searchTerm = searchCriteria.searchTerm;
        let userAchievements;
        let where;
        if (searchTerm !== '') {
            if(searchCriteria.userID !== undefined && searchCriteria.userID !== null){
                where = {
                    [Op.and]: {
                        [Op.or]: {
                            userAchievementID: { [Op.like]: '%' + searchTerm + '%' },
                            achievementID: { [Op.like]: '%' + searchTerm + '%' },
                            achievementName: { [Op.like]: '%' + searchTerm + '%' },
                            gameID: { [Op.like]: '%' + searchTerm + '%' },
                            gameName: { [Op.like]: '%' + searchTerm + '%' },
                            userID: { [Op.like]: '%' + searchTerm + '%' },
                            achievementStatus: { [Op.like]: '%' + searchTerm + '%' },
                            createdAt: { [Op.like]: '%' + searchTerm + '%' },
                            updatedAt: { [Op.like]: '%' + searchTerm + '%' }
                        },
                        userID: searchCriteria.userID
                    }
                };
            } else {
                where = {
                    [Op.or]: {
                        userAchievementID: { [Op.like]: '%' + searchTerm + '%' },
                        achievementID: { [Op.like]: '%' + searchTerm + '%' },
                        achievementName: { [Op.like]: '%' + searchTerm + '%' },
                        gameID: { [Op.like]: '%' + searchTerm + '%' },
                        gameName: { [Op.like]: '%' + searchTerm + '%' },
                        userID: { [Op.like]: '%' + searchTerm + '%' },
                        achievementStatus: { [Op.like]: '%' + searchTerm + '%' },
                        createdAt: { [Op.like]: '%' + searchTerm + '%' },
                        updatedAt: { [Op.like]: '%' + searchTerm + '%' }
                    }
                };
            }
            
        } else {
            if(searchCriteria.userID !== undefined && searchCriteria.userID !== null){
                where = {
                    userID: searchCriteria.userID
                }
            } else {
                where = '';
            }
        }
        userAchievements = await userAchievement.findAll({
            where: where,
            order: [
                [sort, sortDirection],
                ['achievementName', 'ASC'],
            ],
            attributes: ['userAchievementID'],
            raw: true,
        });
        return userAchievements.length;
    } catch (err) {
        console.log(err)
    }
}

async function getAll(searchCriteria) {
    try {
        let sort = searchCriteria.sort;
        let sortDirection = searchCriteria.direction;
        let pagination = searchCriteria.pagination;
        let searchTerm = searchCriteria.searchTerm;
        let limit;
        let offset;
        let page = searchCriteria.page;
        let where;
        if (searchTerm !== '') {
            if(searchCriteria.userID !== undefined && searchCriteria.userID !== null){
                where = {
                    [Op.and]: {
                        [Op.or]: {
                            userAchievementID: { [Op.like]: '%' + searchTerm + '%' },
                            achievementID: { [Op.like]: '%' + searchTerm + '%' },
                            achievementName: { [Op.like]: '%' + searchTerm + '%' },
                            gameID: { [Op.like]: '%' + searchTerm + '%' },
                            gameName: { [Op.like]: '%' + searchTerm + '%' },
                            userID: { [Op.like]: '%' + searchTerm + '%' },
                            achievementStatus: { [Op.like]: '%' + searchTerm + '%' },
                            createdAt: { [Op.like]: '%' + searchTerm + '%' },
                            updatedAt: { [Op.like]: '%' + searchTerm + '%' }
                        },
                        userID: searchCriteria.userID
                    }
                };
            } else {
                where = {
                    [Op.or]: {
                        userAchievementID: { [Op.like]: '%' + searchTerm + '%' },
                        achievementID: { [Op.like]: '%' + searchTerm + '%' },
                        achievementName: { [Op.like]: '%' + searchTerm + '%' },
                        gameID: { [Op.like]: '%' + searchTerm + '%' },
                        gameName: { [Op.like]: '%' + searchTerm + '%' },
                        userID: { [Op.like]: '%' + searchTerm + '%' },
                        achievementStatus: { [Op.like]: '%' + searchTerm + '%' },
                        createdAt: { [Op.like]: '%' + searchTerm + '%' },
                        updatedAt: { [Op.like]: '%' + searchTerm + '%' }
                    }
                };
            }
        } else {
            if(searchCriteria.userID !== undefined && searchCriteria.userID !== null){
                where = {
                    userID: searchCriteria.userID
                };
            } else {
                where = '';
            }
           
        }
        if (pagination === 'true') {
            limit = searchCriteria.limit;
            if (page != 0) {
                offset = page * limit;
            }
            return await userAchievement.findAll({
                where: where,
                include: { 
                    model: achievement,
                    attributes: [
                        'achievementIcon',
                        'achievementDescription'
                    ]
                },
                order: [
                    [sort, sortDirection],
                    ['achievementName', 'ASC'],
                ],
                limit: limit,
                offset: offset,
            });
        } else {
            return await userAchievement.findAll({
                where: where,
                include: { 
                    model: achievement,
                    attributes: [
                        'achievementIcon',
                        'achievementDescription'
                    ]
                },
                order: [
                    [sort, sortDirection],
                    ['achievementName', 'ASC'],
                ],
            });
        } 
    } catch (err) {
        console.log(err)
    }
}

async function create(newUserAchievement) {
    try {
        return await userAchievement.create({
            achievementID: newUserAchievement.achievementID,
            achievementName: newUserAchievement.achievementName,
            gameID: newUserAchievement.gameID,
            gameName: newUserAchievement.gameName,
            userID: newUserAchievement.userID,
            achievementStatus: newUserAchievement.achievementStatus
        });
    } catch (err) {
        console.log(err)
        if (err.errors[0].type === 'unique violation') {
            return err.errors[0].message;
        }
    }
}

async function getOne(userAchievementID) {
    try {
        return await userAchievement.findOne({
            where: { userAchievementID: userAchievementID },
            raw: true
        });
    } catch (err) {
        console.log(err);
    }
}

async function getAllByUserID(userID) {
    try {
        return await userAchievement.findAll({
            where: { userID: userID },
            raw: true
        });
    } catch (err) {
        console.log(err);
    }
}

async function getAllByGameID(body) {
    try {
        let userID = body.userID;
        let gameID = body.gameID;
        return await userAchievement.findAll({
            where: { 
                userID: userID,
                gameID: gameID
            },
            raw: true
        });
    } catch (err) {
        console.log(err);
    }
}

async function update(userAchievementID, newUserAchievement) {
    try {
        return result = await userAchievement.update(
            newUserAchievement,
            {
                where: {
                    userAchievementID: userAchievementID
                }
            }
        );
    } catch (err) {
        console.log(err);
        if (err.errors[0].type === 'unique violation') {
            return err.errors[0].message;
        }
    }
}

async function deleteAchievement(userAchievementID) {
    try {
        return result = await userAchievement.destroy({
            where: {
                userAchievementID: userAchievementID
            }
        });
    } catch (err) {
        console.error(err);
    }
}

async function bulkDelete(userID, gameID) {
    try {
        return result = await userAchievement.destroy({
            where: {
                userID: userID,
                gameID: gameID
            }
        });
    } catch (err) {
        console.error(err);
    }
}

async function getCompletedUserAchievementsRatio(achievementID) {
    try {
        const completedAchievements = await userAchievement.count({
            where: { 
                achievementID: achievementID,
                achievementStatus: 'completed'
            },
            raw: true
        });
        const totalAchievements = await userAchievement.count({
            where: { 
                achievementID: achievementID
            },
            raw: true
        });
        if(completedAchievements != 0 && totalAchievements != 0){
            return completedAchievements / totalAchievements;
        } else if(completedAchievements == 0) {
            return 'No completed achievements.';
        } else if (totalAchievements == 0){
            return 'No users with this achievement.';
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    findCount,
    getAll,
    getOne,
    getAllByUserID,
    getAllByGameID,
    create,
    update,
    deleteAchievement,
    bulkDelete,
    getCompletedUserAchievementsRatio
};