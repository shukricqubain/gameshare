const db = require('../models/index');
const Op = Sequelize.Op;
const userMessage = db.userMessage;
const sentBy = db.user;
const receivedBy = db.user;
userFriend.hasOne(sentBy, {
    foreignKey: 'userID',
    sourceKey: 'userIDSentMessage',
    as: 'SentBy'
});
userFriend.hasOne(receivedBy, {
    foreignKey: 'userID',
    sourceKey: 'userIDReceivedMessage',
    as: 'ReceivedBy'
});
sentBy.belongsTo(userMessage, {
    foreignKey: 'userIDSentMessage',
    sourceKey: 'userID',
    as: 'SentBy'
});
receivedBy.belongsTo(userMessage, {
    foreignKey: 'userIDReceivedMessage',
    sourceKey: 'userID',
    as: 'RecievedBy'
});

// Get count of userMessages by searchCriteria
async function findCount(searchCriteria) {
    try {
        let sort = searchCriteria.sort;
        let sortDirection = searchCriteria.direction;
        let searchTerm = searchCriteria.searchTerm;
        let userMessages;
        let where;
        if (searchTerm !== '') {
            if (searchCriteria.userID != undefined && searchCriteria.userID != null) {
                where = {
                    [Op.and]: {
                        [Op.or]: {
                            userMessageID: { [Op.like]: '%' + searchTerm + '%' },
                            userMessage: { [Op.like]: '%' + searchTerm + '%' },
                            userIDSentMessage: { [Op.like]: '%' + searchTerm + '%' },
                            userIDReceivedMessage: { [Op.like]: '%' + searchTerm + '%' },
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
                        userMessage: { [Op.like]: '%' + searchTerm + '%' },
                        userIDSentRequest: { [Op.like]: '%' + searchTerm + '%' },
                        userIDReceivedRequest: { [Op.like]: '%' + searchTerm + '%' },
                    }
                };
            }
        } else {
            if (searchCriteria.userID != undefined && searchCriteria.userID != null) {
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
        userMessages = await userMessage.findAll({
            where: where,
            order: [
                [sort, sortDirection],
                ['userMessageID', 'ASC']
            ],
            attributes: ['userMessageID'],
            raw: true
        });
        if (userMessages != null && userMessages != undefined) {
            return userMessages.length;
        } else {
            return 0;
        }
    } catch (err) {
        console.error(err);
    }
};

// get all userMessages by searchCriteria
async function findAll(searchCriteria) {
    try {
        let sort = searchCriteria.sort;
        let sortDirection = searchCriteria.direction;
        let searchTerm = searchCriteria.searchTerm;
        let pagination = searchCriteria.pagination;
        let userMessages;
        let where;
        if (searchTerm !== '') {
            if (searchCriteria.userID != undefined && searchCriteria.userID != null) {
                where = {
                    [Op.and]: {
                        [Op.or]: {
                            userMessageID: { [Op.like]: '%' + searchTerm + '%' },
                            userMessage: { [Op.like]: '%' + searchTerm + '%' },
                            userIDSentMessage: { [Op.like]: '%' + searchTerm + '%' },
                            userIDReceivedMessage: { [Op.like]: '%' + searchTerm + '%' },
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
                        userMessage: { [Op.like]: '%' + searchTerm + '%' },
                        userIDSentRequest: { [Op.like]: '%' + searchTerm + '%' },
                        userIDReceivedRequest: { [Op.like]: '%' + searchTerm + '%' },
                    }
                };
            }
        } else {
            if (searchCriteria.userID != undefined && searchCriteria.userID != null) {
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
            userMessages = await userMessage.findAll({
                where: where,
                include: [
                    {    
                        model: sentBy,
                        as: 'SentBy',
                        attributes: [
                            'userName'
                        ],
                    },
                    {    
                        model: receivedBy,
                        as: 'ReceivedBy',
                        attributes: [
                            'userName'
                        ],
                    },
                ],
                order: [
                    [sort, sortDirection],
                    ['userMessageID', 'ASC']
                ],
                limit: limit,
                offset: offset,
                raw: true
            });
        } else {
            userMessages = await userMessage.findAll({
                where: where,
                include: [
                    {    
                        model: sentBy,
                        as: 'SentBy',
                        attributes: [
                            'userName'
                        ],
                    },
                    {    
                        model: receivedBy,
                        as: 'ReceivedBy',
                        attributes: [
                            'userName'
                        ],
                    },
                ],
                order: [
                    [sort, sortDirection],
                    ['userMessageID', 'ASC']
                ],
                raw: true
            });
        }
        if (userMessages != null && userMessages != undefined) {
            return userMessages.length;
        } else {
            return 0;
        }
    } catch (err) {
        console.error(err);
    }
};

// get all userMessages by userIDSentMessage and userIDReceivedMessage
async function getUserMessagesBySentReceivedIDs(req) {
    try {
        return await userMessage.findAll({
            where: {
                userIDSentMessage: {
                    [Op.in]: [req.userIDOne,req.userIDTwo]
                },
                userIDReceivedMessage: {
                    [Op.in]: [req.userIDOne,req.userIDTwo]
                } 
            },
            raw: true
        });
    } catch (err) {
        console.error(err);
    }
};

// get userMessage by userID
async function findAllByUserID(userID) {
    try {
        return await userMessage.findAll({
            where: {
                [Op.or]: {
                    userIDSentMessage: userID,
                    userIDReceivedMessage: userID,
                }
            }
        });
    } catch (err) {
        console.error(err);
    }
};

// create userMessage
async function createUserMessage(newUserMessage) {
    try {
        return await userMessage.create({
            userIDSentMessage: newUserMessage.userIDSentMessage,
            userIDReceivedMessage: newUserMessage.userIDReceivedMessage,
            userMessage: newUserMessage.userMessage,
            isRead: newUserMessage.isRead,
            messageImage: newUserMessage.messageImage,
            createdBy: newUserMessage.createdBy
        });
    } catch (err) {
        console.error(err);
        if (err.errors[0].type === 'unique violation') {
            return err.errors[0].message;
        }
    }
};

// edit a userMessage by userMessageID
async function updateUserMessage(userMessageID, userMessage) {
    try {
        return result = await userMessage.update(
            userMessage,
            {
                where: {
                    userMessageID: userMessageID
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

// delete a userMessage by userMessageID
async function deleteUserMessage(userMessageID) {
    try {
        return result = await userMessage.destroy({
            where: {
                userMessageID: userMessageID
            }
        });
    } catch (err) {
        console.error(err);
    }
};

module.exports = {
    findCount,
    findAll,
    createUserMessage,
    findAllByUserID,
    getUserMessagesBySentReceivedIDs,
    updateUserMessage,
    deleteUserMessage
};