const db = require('../models/index');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const userFriend = db.userFriend;
const sentBy = db.user;
const receivedBy = db.user;
userFriend.hasOne(sentBy, {
    foreignKey: 'userID',
    sourceKey: 'userIDSentRequest',
    as: 'SentBy'
});
userFriend.hasOne(receivedBy, {
    foreignKey: 'userID',
    sourceKey: 'userIDReceivedRequest',
    as: 'ReceivedBy'
});
sentBy.belongsTo(userFriend,{
    foreignKey: 'userIDSentRequest',
    sourceKey: 'userID',
    as: 'SentBy'
});
receivedBy.belongsTo(userFriend,{
    foreignKey: 'userIDReceivedRequest',
    sourceKey: 'userID',
    as: 'RecievedBy'
});

// find count of userFriends based on searchCriteria
async function findCount(searchCriteria) {
    try {
        let sort = searchCriteria.sort;
        let sortDirection = searchCriteria.direction;
        let searchTerm = searchCriteria.searchTerm;
        let userFriends;
        let where;
        if (searchTerm !== '') {
            if(searchCriteria.areFriends != undefined && searchCriteria.areFriends != null){
                if(searchCriteria.areFriends === 'accepted'){
                    where = {
                        [Op.and]: {
                            [Op.or]: {
                                userFriendID: { [Op.like]: '%' + searchTerm + '%' },
                                userIDSentRequest: { [Op.like]: '%' + searchTerm + '%' },
                                userIDReceivedRequest: { [Op.like]: '%' + searchTerm + '%' },
                            },
                            [Op.or]: {
                                userIDSentRequest: searchCriteria.userID,
                                userIDReceivedRequest: searchCriteria.userID,
                            },
                            areFriends: {
                                [Op.eq]: 'accepted'
                            }
                        }
                    };
                } else if(searchCriteria.areFriends === 'not-accepted'){
                    where = {
                        [Op.and]: {
                            [Op.or]: {
                                userFriendID: { [Op.like]: '%' + searchTerm + '%' },
                                userIDSentRequest: { [Op.like]: '%' + searchTerm + '%' },
                                userIDReceivedRequest: { [Op.like]: '%' + searchTerm + '%' },
                            },
                            [Op.or]: {
                                userIDSentRequest: searchCriteria.userID,
                                userIDReceivedRequest: searchCriteria.userID,
                            },
                            areFriends: {
                                [Op.not]: 'accepted'
                            }
                        }
                    };
                }
            } else if (searchCriteria.userID != undefined && searchCriteria.userID != null) {
                where = {
                    [Op.and]: {
                        [Op.or]: {
                            userFriendID: { [Op.like]: '%' + searchTerm + '%' },
                            userIDSentRequest: { [Op.like]: '%' + searchTerm + '%' },
                            userIDReceivedRequest: { [Op.like]: '%' + searchTerm + '%' },
                        },
                        [Op.or]: {
                            userIDSentRequest: searchCriteria.userID,
                            userIDReceivedRequest: searchCriteria.userID,
                        }
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
            if(searchCriteria.areFriends != undefined && searchCriteria.areFriends != null) {
                if(searchCriteria.areFriends === 'accepted'){
                    where = {
                        [Op.and]: {
                            [Op.or]: {
                                userFriendID: { [Op.like]: '%' + searchTerm + '%' },
                                userIDSentRequest: { [Op.like]: '%' + searchTerm + '%' },
                                userIDReceivedRequest: { [Op.like]: '%' + searchTerm + '%' },
                            },
                            [Op.or]: {
                                userIDSentRequest: searchCriteria.userID,
                                userIDReceivedRequest: searchCriteria.userID,
                            },
                            areFriends: {
                                [Op.eq]: 'accepted'
                            }
                        }
                    };
                } else if(searchCriteria.areFriends === 'not-accepted'){
                    where = {
                        [Op.and]: {
                            [Op.or]: {
                                userFriendID: { [Op.like]: '%' + searchTerm + '%' },
                                userIDSentRequest: { [Op.like]: '%' + searchTerm + '%' },
                                userIDReceivedRequest: { [Op.like]: '%' + searchTerm + '%' },
                            },
                            [Op.or]: {
                                userIDSentRequest: searchCriteria.userID,
                                userIDReceivedRequest: searchCriteria.userID,
                            },
                            areFriends: {
                                [Op.not]: 'accepted'
                            }
                        }
                    };
                }
            } else if (searchCriteria.userID != undefined && searchCriteria.userID != null) {
                where = {
                    [Op.or]: {
                        userIDSentRequest: searchCriteria.userID,
                        userIDReceivedRequest: searchCriteria.userID,
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
            if(searchCriteria.areFriends != undefined && searchCriteria.areFriends != null){
                if(searchCriteria.areFriends === 'accepted'){
                    where = {
                        [Op.and]: {
                            [Op.or]: {
                                userFriendID: { [Op.like]: '%' + searchTerm + '%' },
                                userIDSentRequest: { [Op.like]: '%' + searchTerm + '%' },
                                userIDReceivedRequest: { [Op.like]: '%' + searchTerm + '%' },
                            },
                            [Op.or]: {
                                userIDSentRequest: searchCriteria.userID,
                                userIDReceivedRequest: searchCriteria.userID,
                            },
                            areFriends: {
                                [Op.eq]: 'accepted'
                            }
                        }
                    };
                } else if(searchCriteria.areFriends === 'not-accepted'){
                    where = {
                        [Op.and]: {
                            [Op.or]: {
                                userFriendID: { [Op.like]: '%' + searchTerm + '%' },
                                userIDSentRequest: { [Op.like]: '%' + searchTerm + '%' },
                                userIDReceivedRequest: { [Op.like]: '%' + searchTerm + '%' },
                            },
                            [Op.or]: {
                                userIDSentRequest: searchCriteria.userID,
                                userIDReceivedRequest: searchCriteria.userID,
                            },
                            areFriends: {
                                [Op.not]: 'accepted'
                            }
                        }
                    };
                }
            } else if (searchCriteria.userID != undefined && searchCriteria.userID != null) {
                where = {
                    [Op.and]: {
                        [Op.or]: {
                            userFriendID: { [Op.like]: '%' + searchTerm + '%' },
                            userIDSentRequest: { [Op.like]: '%' + searchTerm + '%' },
                            userIDReceivedRequest: { [Op.like]: '%' + searchTerm + '%' },
                        },
                        [Op.or]: {
                            userIDSentRequest: searchCriteria.userID,
                            userIDReceivedRequest: searchCriteria.userID,
                        }
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
            if(searchCriteria.areFriends != undefined && searchCriteria != null){
                if(searchCriteria.areFriends === 'accepted'){
                    where = {
                        [Op.and]: {
                            [Op.or]: {
                                userIDSentRequest: searchCriteria.userID,
                                userIDReceivedRequest: searchCriteria.userID,
                            },
                            areFriends: {
                                [Op.eq]: 'accepted'
                            }
                        }
                    };
                } else if(searchCriteria.areFriends === 'not-accepted'){
                    where = {
                        [Op.and]: {
                            [Op.or]: {
                                userIDSentRequest: searchCriteria.userID,
                                userIDReceivedRequest: searchCriteria.userID,
                            },
                            areFriends: {
                                [Op.not]: 'accepted'
                            }
                        }
                    };
                }
            } else if (searchCriteria.userID != undefined && searchCriteria.userID != null) {
                where = {
                    [Op.or]: {
                        userIDSentRequest: searchCriteria.userID,
                        userIDReceivedRequest: searchCriteria.userID,
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
                attributes: [
                    'areFriends',
                    'createdAt',
                    'createdBy',
                    'updatedAt',
                    'updatedBy',
                    'userFriendID',
                    'userIDReceivedRequest',
                    'userIDSentRequest',
                    [Sequelize.col("SentBy.userName"), "sentByUserName"],
                    [Sequelize.col("SentBy.profilePicture"), "sentByProfilePicture"],
                    [Sequelize.col("ReceivedBy.userName"), "receivedByUserName"],
                    [Sequelize.col("ReceivedBy.profilePicture"), "receivedByProfilePicture"],
                ],
                include: [
                    {    
                        model: sentBy,
                        as: 'SentBy',
                        attributes: [],
                    },
                    {    
                        model: receivedBy,
                        as: 'ReceivedBy',
                        attributes: [],
                    },
                ],
                order: [
                    [sort, sortDirection],
                    ['userFriendID', 'ASC']
                ],
                limit: limit,
                offset: offset,
                raw: true
            });
        } else {
            return await userFriend.findAll({
                where: where,
                attributes: [
                    'areFriends',
                    'createdAt',
                    'createdBy',
                    'updatedAt',
                    'updatedBy',
                    'userFriendID',
                    'userIDReceivedRequest',
                    'userIDSentRequest',
                    [Sequelize.col("SentBy.userName"), "sentByUserName"],
                    [Sequelize.col("SentBy.profilePicture"), "sentByProfilePicture"],
                    [Sequelize.col("ReceivedBy.userName"), "receivedByUserName"],
                    [Sequelize.col("ReceivedBy.profilePicture"), "receivedByProfilePicture"],
                ],
                include: [
                    {    
                        model: sentBy,
                        as: 'SentBy',
                        attributes: [],
                    },
                    {    
                        model: receivedBy,
                        as: 'ReceivedBy',
                        attributes: [],
                    },
                ],
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

async function findAllByUserID(userID){
    try {
        return await userFriend.findAll({
            where: {
                [Op.or]: {
                    userIDSentRequest: userID,
                    userIDReceivedRequest: userID,
                }
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
                userIDSentRequest: {
                    [Op.in]: [req.userIDOne,req.userIDTwo]
                },
                userIDReceivedRequest: {
                    [Op.in]: [req.userIDOne,req.userIDTwo]
                } 
            },
            raw: true
        });
    } catch (err) {
        console.error(err);
    }
}

// get all mutual friends between two ids
async function getMutualFriends(req){
    try {
        let friendListOne = await userFriend.findAll({
            attributes: [
                [Sequelize.col("SentBy.userID"), "sentByUserID"],
                [Sequelize.col("ReceivedBy.userID"), "receivedByUserID"],
                [Sequelize.col("SentBy.userName"), "sentByUserName"],
                [Sequelize.col("SentBy.profilePicture"), "sentByProfilePicture"],
                [Sequelize.col("ReceivedBy.userName"), "receivedByUserName"],
                [Sequelize.col("ReceivedBy.profilePicture"), "receivedByProfilePicture"],
            ],
            where: {
                [Op.and]: {
                    areFriends: 'accepted',
                    [Op.or]: {
                        userIDSentRequest: {
                            [Op.in]: [req.userIDOne]
                        },
                        userIDReceivedRequest: {
                            [Op.in]: [req.userIDOne]
                        }
                    }
                }
                
            },
            include: [
                {    
                    model: sentBy,
                    as: 'SentBy',
                    attributes: [],
                },
                {    
                    model: receivedBy,
                    as: 'ReceivedBy',
                    attributes: [],
                },
            ],
            raw: true
        });
        let friendListTwo = await userFriend.findAll({
            attributes: [
                [Sequelize.col("SentBy.userID"), "sentByUserID"],
                [Sequelize.col("SentBy.userName"), "sentByUserName"],
                [Sequelize.col("SentBy.profilePicture"), "sentByProfilePicture"],
                [Sequelize.col("ReceivedBy.userID"), "receivedByUserID"],
                [Sequelize.col("ReceivedBy.userName"), "receivedByUserName"],
                [Sequelize.col("ReceivedBy.profilePicture"), "receivedByProfilePicture"],
            ],
            where: {
                [Op.and]: {
                    areFriends: 'accepted',
                    [Op.or]: {
                        userIDSentRequest: {
                            [Op.in]: [req.userIDTwo]
                        },
                        userIDReceivedRequest: {
                            [Op.in]: [req.userIDTwo]
                        }
                    }
                }
                
            },
            include: [
                {    
                    model: sentBy,
                    as: 'SentBy',
                    attributes: [],
                },
                {    
                    model: receivedBy,
                    as: 'ReceivedBy',
                    attributes: [],
                },
            ],
            raw: true
        });
        let potentialMutualsOne = [];
        let potentialMutualsTwo = [];
        let mutualFriends = [];
        ///find all friendships for first user
        for(let friend of friendListOne){
            if(friend.receivedByUserID != req.userIDOne){
                let mutualFriend = {
                    userID: friend.receivedByUserID,
                    userName: friend.receivedByUserName,
                    profilePicture: friend.receivedByProfilePicture
                }
                potentialMutualsOne.push(mutualFriend);
            } else if(friend.sentByUserID != req.userIDOne){
                let mutualFriend = {
                    userID: friend.sentByUserID,
                    userName: friend.sentByUserName,
                    profilePicture: friend.sentByProfilePicture
                }
                potentialMutualsOne.push(mutualFriend);
            }
        }
        ///find all friendships for second user
        for(let friend of friendListTwo){
            if(friend.sentByUserID != req.userIDTwo){
                let mutualFriend = {
                    userID: friend.sentByUserID,
                    userName: friend.sentByUserName,
                    profilePicture: friend.sentByProfilePicture
                }
                potentialMutualsTwo.push(mutualFriend);
            } else if (friend.receivedByUserID != req.userIDTwo){
                let mutualFriend = {
                    userID: friend.receivedByUserID,
                    userName: friend.receivedByUserName,
                    profilePicture: friend.receivedByProfilePicture
                }
                potentialMutualsTwo.push(mutualFriend);
            }
        }
        ///find intersecting friends
        for(let friend of potentialMutualsOne){
            if(potentialMutualsTwo.find(obj => obj.userID == friend.userID) && !mutualFriends.find(obj => obj.userID == friend.userID)){
                mutualFriends.push(friend);
            }
        }
        for(let friend of potentialMutualsTwo){
            if(potentialMutualsOne.find(obj => obj.userID == friend.userID) && !mutualFriends.find(obj => obj.userID == friend.userID)){
                mutualFriends.push(friend);
            }
        }
        return mutualFriends;
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
    getMutualFriends,
    findAllByUserID,
    updateUserFriend,
    deleteUserFriend
}