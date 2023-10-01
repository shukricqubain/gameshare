const db = require('../models/index');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

async function findCount(searchCriteria) {
    try {
        let sort = searchCriteria.sort;
        let sortDirection = searchCriteria.direction;
        let searchTerm = searchCriteria.searchTerm;
        let achievements;
        if (searchTerm !== '') {
            achievements = await db.achievement.findAll({
                where: {
                    [Op.or]: {
                        achievementID: { [Op.like]: '%' + searchTerm + '%'},
                        gameID: { [Op.like]: '%' + searchTerm + '%' },
                        achievementName: { [Op.like]: '%' + searchTerm + '%' },
                        achievementDescription: { [Op.like]: '%' + searchTerm + '%' },
                    }
                },
                order: [
                    [sort, sortDirection],
                    ['achievementName', 'ASC'],
                ],
                attributes: ['achievementID'],
                raw: true,
            });
        } else {
            achievements = await db.achievement.findAll({
                order: [
                    [sort, sortDirection],
                    ['achievementName', 'ASC'],
                ],
                attributes: ['achievementID'],
                raw: true,
            });
        }
        return achievements.length;
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
        if (searchTerm !== '') {
            if (pagination) {
                limit = searchCriteria.limit;
                if (page != 0) {
                    offset = page * limit;
                    return await db.achievement.findAll({
                        where: {
                            [Op.or]: {
                                achievementID: { [Op.like]: '%' + searchTerm + '%'},
                                gameID: { [Op.like]: '%' + searchTerm + '%' },
                                gameName: { [Op.like]: '%' + searchTerm + '%' },
                                achievementName: { [Op.like]: '%' + searchTerm + '%' },
                                achievementDescription: { [Op.like]: '%' + searchTerm + '%' },
                            }
                        },
                        order: [
                            [sort, sortDirection],
                            ['achievementName', 'ASC'],
                        ],
                        limit: limit,
                        offset: offset,
                        attributes: [
                            'achievementID',
                            'gameID',
                            'achievementName',
                            'achievementDescription',
                            'achievementIcon',
                            'gameName',
                            'createdAt',
                            'updatedAt'
                        ],
                        raw: true,
                    });
                } else {
                    return await db.achievement.findAll({
                        where: {
                            [Op.or]: {
                                achievementID: { [Op.like]: '%' + searchTerm + '%'},
                                gameID: { [Op.like]: '%' + searchTerm + '%' },
                                gameName: { [Op.like]: '%' + searchTerm + '%' },
                                achievementName: { [Op.like]: '%' + searchTerm + '%' },
                                achievementDescription: { [Op.like]: '%' + searchTerm + '%' },
                            }
                        },
                        order: [
                            [sort, sortDirection],
                            ['achievementName', 'ASC'],
                        ],
                        limit: limit,
                        attributes: [
                            'achievementID',
                            'gameID',
                            'achievementName',
                            'achievementDescription',
                            'achievementIcon',
                            'gameName',
                            'createdAt',
                            'updatedAt'
                        ],
                        raw: true,
                    });
                }
            } else {
                return await db.achievement.findAll({
                    where: {
                        [Op.or]: {
                            achievementID: { [Op.like]: '%' + searchTerm + '%'},
                            gameID: { [Op.like]: '%' + searchTerm + '%' },
                            gameName: { [Op.like]: '%' + searchTerm + '%' },
                            achievementName: { [Op.like]: '%' + searchTerm + '%' },
                            achievementDescription: { [Op.like]: '%' + searchTerm + '%' },
                        }
                    },
                    order: [
                        [sort, sortDirection],
                        ['achievementName', 'ASC'],
                    ],
                    attributes: [
                        'achievementID',
                        'gameID',
                        'achievementName',
                        'achievementDescription',
                        'achievementIcon',
                        'gameName',
                        'createdAt',
                        'updatedAt'
                    ],
                    raw: true,
                });
            }
        } else {
            if (pagination) {
                limit = searchCriteria.limit;
                if (page != 0) {
                    offset = page * limit;
                    return await db.achievement.findAll({
                        order: [
                            [sort, sortDirection],
                            ['achievementName', 'ASC'],
                        ],
                        limit: limit,
                        offset: offset,
                        attributes: [
                            'achievementID',
                            'gameID',
                            'achievementName',
                            'achievementDescription',
                            'achievementIcon',
                            'gameName',
                            'createdAt',
                            'updatedAt'
                        ],
                        raw: true,
                    });
                } else {
                    return await db.achievement.findAll({
                        order: [
                            [sort, sortDirection],
                            ['achievementName', 'ASC'],
                        ],
                        limit: limit,
                        attributes: [
                            'achievementID',
                            'gameID',
                            'achievementName',
                            'achievementDescription',
                            'achievementIcon',
                            'gameName',
                            'createdAt',
                            'updatedAt'
                        ],
                        raw: true,
                    });
                }
            } else {
                return await db.achievement.findAll({
                    order: [
                        [sort, sortDirection],
                        ['achievementName', 'ASC'],
                    ],
                    attributes: [
                        'achievementID',
                        'gameID',
                        'achievementName',
                        'achievementDescription',
                        'achievementIcon',
                        'gameName',
                        'createdAt',
                        'updatedAt'
                    ],
                    raw: true,
                });
            }
        }

    } catch (err) {
        console.log(err)
    }
}

async function create(achievement){
    try{
        return await db.achievement.create({
            achievementID: achievement.achievementID,
            gameID: achievement.gameID,
            achievementName: achievement.achievementName,
            achievementDescription: achievement.achievementDescription,
            achievementIcon: achievement.achievementIcon,
            gameName: achievement.gameName
        });
    } catch(err){
        console.log(err)
        if(err.errors[0].type === 'unique violation'){
            return err.errors[0].message;
        }
    }
}

async function getOne(achievementID){
    try{
        return await db.achievement.findOne({
            where: {achievementID: achievementID},
            raw: true
        });
    } catch(err){
        console.log(err);
    }
}

async function update(achievementID, achievement){
    try{
        return result = await db.achievement.update(
            achievement,
            {
                where:{
                    achievementID: achievementID
                }
            }
        );
    } catch(err){
        console.log(err);
        if(err.errors[0].type === 'unique violation'){
            return err.errors[0].message;
        }
    }
}

async function deleteAchievement(achievementID){
    try{
        return result = await db.achievement.destroy({
            where:{
                achievementID: achievementID
            }
        });
    } catch(err){
        console.log(err);
    }
}

async function getAllAchievementNames(){
    try{
        return await db.achievement.findAll({
            order: [
                ['achievementName', 'ASC'],
            ],
            attributes: [
                'gameID',
                'achievementName',
            ],
            raw: true
        });
    } catch(err){
        console.log(err);
    }
}

module.exports = {
    findCount,
    getAll,
    getAllAchievementNames,
    getOne,
    create,
    update,
    deleteAchievement
};