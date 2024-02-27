const db = require('../models/index');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const userChat = db.userChat;
const userOne = db.user;
const userTwo = db.user;
userChat.hasOne(userOne, {
    foreignKey: 'userID',
    sourceKey: 'userOneID',
    as: 'userOne'
});
userChat.hasOne(userTwo, {
    foreignKey: 'userID',
    sourceKey: 'userTwoID',
    as: 'userTwo'
});
userOne.belongsTo(userChat, {
    foreignKey: 'userOneID',
    sourceKey: 'userID',
    as: 'userOne'
});
userTwo.belongsTo(userChat, {
    foreignKey: 'userTwoID',
    sourceKey: 'userID',
    as: 'userTwo'
});

// Get count of userChats by searchCriteria
async function findCount(searchCriteria) {
    try {
        let sort = searchCriteria.sort;
        let sortDirection = searchCriteria.direction;
        let searchTerm = searchCriteria.searchTerm;
        let userChats;
        let where;
        if (searchTerm !== '') {
            if (searchCriteria.userID != undefined && searchCriteria.userID != null) {
                where = {
                    [Op.and]: {
                        [Op.or]: {
                            userChatID: { [Op.like]: '%' + searchTerm + '%' },
                            userOneID: { [Op.like]: '%' + searchTerm + '%' },
                            userTwoID: { [Op.like]: '%' + searchTerm + '%' },
                        },
                        [Op.or]: {
                            userOneID: searchCriteria.userID,
                            userTwoID: searchCriteria.userID,
                        }
                    }
                };
            } else {
                where = {
                    [Op.or]: {
                        userChatID: { [Op.like]: '%' + searchTerm + '%' },
                        userOneID: { [Op.like]: '%' + searchTerm + '%' },
                        userTwoID: { [Op.like]: '%' + searchTerm + '%' },
                    },
                };
            }
        } else {
            if (searchCriteria.userID != undefined && searchCriteria.userID != null) {
                where = {
                    [Op.or]: {
                        userOneID: searchCriteria.userID,
                        userTwoID: searchCriteria.userID,
                    }
                };
            } else {
                where = '';
            }
        }
        userChats = await userChat.findAll({
            where: where,
            order: [
                [sort, sortDirection],
                ['userChatID', 'ASC']
            ],
            attributes: ['userChatID'],
            raw: true
        });
        if (userChats != null && userChats != undefined) {
            return userChats.length;
        } else {
            return 0;
        }
    } catch (err) {
        console.error(err);
    }
};

// get all userChats by searchCriteria
async function findAll(searchCriteria) {
    try {
        let sort = searchCriteria.sort;
        let sortDirection = searchCriteria.direction;
        let searchTerm = searchCriteria.searchTerm;
        let pagination = searchCriteria.pagination;
        let userChats;
        let limit;
        let offset;
        let page = searchCriteria.page;
        let where;
        if (searchTerm !== '') {
            if (searchCriteria.userID != undefined && searchCriteria.userID != null) {
                where = {
                    [Op.and]: {
                        [Op.or]: {
                            userChatID: { [Op.like]: '%' + searchTerm + '%' },
                            userOneID: { [Op.like]: '%' + searchTerm + '%' },
                            userTwoID: { [Op.like]: '%' + searchTerm + '%' },
                        },
                        [Op.or]: {
                            userOneID: searchCriteria.userID,
                            userTwoID: searchCriteria.userID,
                        }
                    }
                };
            } else {
                where = {
                    [Op.or]: {
                        userChatID: { [Op.like]: '%' + searchTerm + '%' },
                        userOneID: { [Op.like]: '%' + searchTerm + '%' },
                        userTwoID: { [Op.like]: '%' + searchTerm + '%' },
                    },
                };
            }
        } else {
            if (searchCriteria.userID != undefined && searchCriteria.userID != null) {
                where = {
                    [Op.or]: {
                        userOneID: searchCriteria.userID,
                        userTwoID: searchCriteria.userID,
                    }
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
            userChats = await userChat.findAll({
                where: where,
                include: [
                    {    
                        model: userOne,
                        as: 'userOne',
                        attributes: [
                            'userName'
                        ],
                    },
                    {    
                        model: userTwo,
                        as: 'userTwo',
                        attributes: [
                            'userName'
                        ],
                    },
                ],
                order: [
                    [sort, sortDirection],
                    ['userChatID', 'ASC']
                ],
                limit: limit,
                offset: offset,
                raw: true
            });
        } else {
            userChats = await userChats.findAll({
                where: where,
                include: [
                    {    
                        model: userOne,
                        as: 'userOne',
                        attributes: [
                            'userName'
                        ],
                    },
                    {    
                        model: userTwo,
                        as: 'userTwo',
                        attributes: [
                            'userName'
                        ],
                    },
                ],
                order: [
                    [sort, sortDirection],
                    ['userTwoID', 'ASC']
                ],
                raw: true
            });
        }
        if (userChats != null && userChats != undefined) {
            return userChats;
        } else {
            return 0;
        }
    } catch (err) {
        console.error(err);
    }
};

// get all userChats by userOneID and userTwoID
async function getUserChatsByIDs(req) {
    try {
        return await userChat.findAll({
            where: {
                userOneID: {
                    [Op.in]: [req.userIDOne,req.userIDTwo]
                },
                userTwoID: {
                    [Op.in]: [req.userIDOne,req.userIDTwo]
                } 
            },
            raw: true
        });
    } catch (err) {
        console.error(err);
    }
};

// get userChat by userID
async function findAllByUserID(userID) {
    try {
        return await userChat.findAll({
            where: {
                [Op.or]: {
                    userOneID: userID,
                    userTwoID: userID,
                }
            }
        });
    } catch (err) {
        console.error(err);
    }
};

async function findOne(userChatID){
    try {
        return result = await userChat.findOne({
            where: {
                userChatID: userChatID
            }
        });
    } catch (err) {
        console.error(err);
    }
}

// create userChat
async function createUserChat(newUserChat) {
    try {
        return await userChat.create({
            userOneID: newUserChat.userOneID,
            userTwoID: newUserChat.userTwoID,
            createdBy: newUserChat.createdBy
        });
    } catch (err) {
        console.error(err);
        if (err.errors[0].type === 'unique violation') {
            return err.errors[0].message;
        }
    }
};

// edit a userChat by userChatID
async function updateUserChat(userChatID, userChat) {
    try {
        return result = await userChat.update(
            userChat,
            {
                where: {
                    userChatID: userChatID
                }
            }
        );
    } catch (err) {
        console.error(err);
        if (err.errors[0].type === 'unique violation') {
            return err.errors[0].message;
        }
    }
};

// delete a userChat by userChatID
async function deleteUserChat(userChatID) {
    try {
        return result = await userChat.destroy({
            where: {
                userChatID: userChatID
            }
        });
    } catch (err) {
        console.error(err);
    }
};

module.exports = {
    findCount,
    findAll,
    findOne,
    createUserChat,
    findAllByUserID,
    getUserChatsByIDs,
    updateUserChat,
    deleteUserChat
};