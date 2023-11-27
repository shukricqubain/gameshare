const db = require('../models/index');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

async function findCount(searchCriteria) {
    try {
        let sort = searchCriteria.sort;
        let sortDirection = searchCriteria.direction;
        let searchTerm = searchCriteria.achievementSearchTerm;
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
                        userID: userID
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
        userAchievements = await db.userAchievement.findAll({
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
        let searchTerm = searchCriteria.achievementSearchTerm;
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
            return await db.userAchievement.findAll({
                where: where,
                order: [
                    [sort, sortDirection],
                    ['achievementName', 'ASC'],
                ],
                limit: limit,
                offset: offset,
                attributes: [
                    'userAchievementID',
                    'achievementID',
                    'achievementName',
                    'gameID',
                    'gameName',
                    'userID',
                    'achievementStatus',
                    'createdAt',
                    'updatedAt'
                ],
                raw: true,
            });
        } else {
            return await db.userAchievement.findAll({
                where: where,
                order: [
                    [sort, sortDirection],
                    ['achievementName', 'ASC'],
                ],
                attributes: [
                    'userAchievementID',
                    'achievementID',
                    'achievementName',
                    'gameID',
                    'gameName',
                    'userID',
                    'achievementStatus',
                    'createdAt',
                    'updatedAt'
                ],
                raw: true,
            });
        } 
    } catch (err) {
        console.log(err)
    }
}

async function create(userAchievement) {
    try {
        return await db.userAchievement.create({
            achievementID: userAchievement.achievementID,
            achievementName: userAchievement.achievementName,
            gameID: userAchievement.gameID,
            gameName: userAchievement.gameName,
            userID: userAchievement.userID,
            achievementStatus: userAchievement.achievementStatus
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
        return await db.userAchievement.findOne({
            where: { userAchievementID: userAchievementID },
            raw: true
        });
    } catch (err) {
        console.log(err);
    }
}

async function update(userAchievementID, userAchievement) {
    try {
        return result = await db.userAchievement.update(
            userAchievement,
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
        return result = await db.userAchievement.destroy({
            where: {
                userAchievementID: userAchievementID
            }
        });
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    findCount,
    getAll,
    getOne,
    create,
    update,
    deleteAchievement
};