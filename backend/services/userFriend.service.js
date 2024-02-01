const db = require('../models/index');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const userFriend = db.userFriend;

// find count of userFriends based on searchCriteria
async function findCount(searchCriteria) {
    try {
        let sort = searchCriteria.sort;
        let sortDirection = searchCriteria.direction;
        let searchTerm = searchCriteria.searchTerm;
        let userFriends;
        let where;
        if (searchTerm !== '') {
            if (searchCriteria.userID != undefined && searchCriteria.userID != null) {
                where = {
                    [Op.and]: {
                        [Op.or]: {
                            userFriendID: { [Op.like]: '%' + searchTerm + '%' },
                            userIDSentRequest: { [Op.like]: '%' + searchTerm + '%' },
                            userIDReceivedRequest: { [Op.like]: '%' + searchTerm + '%' },
                        },
                        userID: searchCriteria.userID
                    }
                };
            } else {
                where = {
                    [Op.or]: {
                        userFriendID: { [Op.like]: '%' + searchTerm + '%' },
                        userIDSentRequest: { [Op.like]: '%' + searchTerm + '%' },
                        userIDReceivedRequest: { [Op.like]: '%' + searchTerm + '%' },
                    }
                };
            }
        } else {
            if (searchCriteria.userID != undefined && searchCriteria.userID != null) {
                where = {
                    [Op.or]: {
                        userIDSentRequest: userID,
                        userIDReceivedRequest: userID,
                    }
                };
            } else {
                where = '';
            }
        }
        userFriends = await userFriend.findAll({
            where: where,
            order: [
                [sort, sortDirection],
                ['userFriendID', 'ASC']
            ],
            attributes: ['userFriendID'],
            raw: true
        });
        if (userFriends != null && userFriends != undefined) {
            return userFriends.length;
        } else {
            return 0;
        }
    } catch (err) {
        console.error(err);
    }
}

// find all userFriends based on searchCriteria
async function findAll(searchCriteria) {
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
            if (searchCriteria.userID != undefined && searchCriteria.userID != null) {
                where = {
                    [Op.and]: {
                        [Op.or]: {
                            userFriendID: { [Op.like]: '%' + searchTerm + '%' },
                            userIDSentRequest: { [Op.like]: '%' + searchTerm + '%' },
                            userIDReceivedRequest: { [Op.like]: '%' + searchTerm + '%' },
                        },
                        userID: searchCriteria.userID
                    }
                };
            } else {
                where = {
                    [Op.or]: {
                        userFriendID: { [Op.like]: '%' + searchTerm + '%' },
                        userIDSentRequest: { [Op.like]: '%' + searchTerm + '%' },
                        userIDReceivedRequest: { [Op.like]: '%' + searchTerm + '%' },
                    }
                };
            }
        } else {
            if (searchCriteria.userID != undefined && searchCriteria.userID != null) {
                where = {
                    [Op.or]: {
                        userIDSentRequest: userID,
                        userIDReceivedRequest: userID,
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
            return await userFriend.findAll({
                where: where,
                order: [
                    [sort, sortDirection],
                    ['userFriendID', 'ASC']
                ],
                limit: limit,
                offset: offset
            });
        } else {
            return await userFriend.findAll({
                where: where,
                order: [
                    [sort, sortDirection],
                    ['userFriendID', 'ASC']
                ],
                raw: true
            });
        }
    } catch (err) {
        console.error(err);
    }
}

// create userFriend
async function createUserFriend(newUserFriend) {
    try {
        return await userFriend.create({
            userIDSentRequest: newUserFriend.userIDSentRequest,
            userIDReceivedRequest: newUserFriend.userIDReceivedRequest,
            areFriends: newUserFriend.areFriends,
            createdBy: newUserFriend.createdBy
        });
    } catch (err) {
        console.error(err);
        if (err.errors[0].type === 'unique violation') {
            return err.errors[0].message;
        }
    }
}

// get one by userFriendID
async function getOneUserFriend(userFriendID) {
    try {
        return await userFriend.findOne({
            where: {
                userFriendID: userFriendID,
            },
            raw: true
        });
    } catch (err) {
        console.error(err);
    }
}

// get one by sentUserID ReceivedUserID
async function getUserSentAndUserReceivedID(req) {
    try {
        return await userFriend.findOne({
            where: {
                userIDSentRequest: req.userIDSentRequest,
                userIDReceivedRequest: req.userIDReceivedRequest
            },
            raw: true
        });
    } catch (err) {
        console.error(err);
    }
}

// update userFriend by userFriendID
async function updateUserFriend(userFriendID, updatedUserFriend) {
    try {
        return result = await userFriend.update(
            updatedUserFriend,
            {
                where: {
                    userFriendID: userFriendID
                }
            }
        );
    } catch (err) {
        console.error(err);
        if (err.errors[0].type === 'unique violation') {
            return err.errors[0].message;
        }
    }
}

// delete userFriend by userFriendID
async function deleteUserFriend(userFriendID) {
    try {
        return result = await userFriend.destroy({
            where: {
                userFriendID: userFriendID
            }
        });
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    findCount,
    findAll,
    createUserFriend,
    getOneUserFriend,
    getUserSentAndUserReceivedID,
    updateUserFriend,
    deleteUserFriend
}