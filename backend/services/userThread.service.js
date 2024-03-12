const db = require('../models/index');
const userThread = db.userThread;
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

async function findCount(searchCriteria) {
    try {
        let sort = searchCriteria.sort;
        let sortDirection = searchCriteria.direction;
        let searchTerm = searchCriteria.searchTerm;
        let userThreads;
        let where;
        if (searchTerm !== '') {
            if (searchCriteria.userID !== undefined && searchCriteria.userID !== null) {
                where = {
                    [Op.and]: {
                        [Op.or]: {
                            userThreadID: { [Op.like]: '%' + searchTerm + '%' },
                            threadID: { [Op.like]: '%' + searchTerm + '%' },
                            boardID: { [Op.like]: '%' + searchTerm + '%' },
                            boardName: { [Op.like]: '%' + searchTerm + '%' },
                            threadName: { [Op.like]: '%' + searchTerm + '%' },
                            userID: { [Op.like]: '%' + searchTerm + '%' }
                        },
                        userID: searchCriteria.userID
                    }
                };
            } else {
                where = {
                    [Op.or]: {
                        userThreadID: { [Op.like]: '%' + searchTerm + '%' },
                        threadID: { [Op.like]: '%' + searchTerm + '%' },
                        boardID: { [Op.like]: '%' + searchTerm + '%' },
                        boardName: { [Op.like]: '%' + searchTerm + '%' },
                        threadName: { [Op.like]: '%' + searchTerm + '%' },
                        userID: { [Op.like]: '%' + searchTerm + '%' }
                    }
                };
            }

        } else {
            if (searchCriteria.userID !== undefined && searchCriteria.userID !== null) {
                where = {
                    userID: searchCriteria.userID
                };
            } else {
                where = '';
            }
        }
        userThreads = await userThread.findAll({
            where: where,
            order: [
                [sort, sortDirection],
                ['threadName', 'ASC'],
            ],
            attributes: ['userThreadID'],
            raw: true,
        });
        return userThreads.length;
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
            if (searchCriteria.userID !== undefined && searchCriteria.userID !== null) {
                where = {
                    [Op.and]: {
                        [Op.or]: {
                            userThreadID: { [Op.like]: '%' + searchTerm + '%' },
                            threadID: { [Op.like]: '%' + searchTerm + '%' },
                            boardID: { [Op.like]: '%' + searchTerm + '%' },
                            boardName: { [Op.like]: '%' + searchTerm + '%' },
                            threadName: { [Op.like]: '%' + searchTerm + '%' },
                            userID: { [Op.like]: '%' + searchTerm + '%' }
                        },
                        userID: searchCriteria.userID
                    }
                };
            } else {
                where = {
                    [Op.or]: {
                        userThreadID: { [Op.like]: '%' + searchTerm + '%' },
                        threadID: { [Op.like]: '%' + searchTerm + '%' },
                        boardID: { [Op.like]: '%' + searchTerm + '%' },
                        boardName: { [Op.like]: '%' + searchTerm + '%' },
                        threadName: { [Op.like]: '%' + searchTerm + '%' },
                        userID: { [Op.like]: '%' + searchTerm + '%' }
                    }
                };
            }

        } else {
            if (searchCriteria.userID !== undefined && searchCriteria.userID !== null) {
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
            return await userThread.findAll({
                where: where,
                order: [
                    [sort, sortDirection],
                    ['threadName', 'ASC'],
                ],
                limit: limit,
                offset: offset,
                raw: true,
            });
        } else {
            return await userThread.findAll({
                where: where,
                order: [
                    [sort, sortDirection],
                    ['threadName', 'ASC'],
                ],
                raw: true,
            });
        }
    } catch (err) {
        console.log(err)
    }
}

async function create(newUserThread) {
    try {
        return await userThread.create({
            userThreadID: newUserThread.userThreadID,
            threadID: newUserThread.threadID,
            boardID: newUserThread.boardID,
            boardName: newUserThread.boardName,
            userID: newUserThread.userID,
            threadName: newUserThread.threadName
        });
    } catch (err) {
        console.log(err)
        if (err.errors[0].type === 'unique violation') {
            return err.errors[0].message;
        }
    }
}

async function getOne(userThreadID) {
    try {
        return await userThread.findOne({
            where: { userThreadID: userThreadID },
            raw: true
        });
    } catch (err) {
        console.log(err);
    }
}

async function findThreadHighlights(userID) {
    try {
        return await userThread.findAll({
            where: {
                userID: userID
            },
            raw: true
        });
    } catch (err) {
        console.error(err);
    }
}

async function update(userThreadID, updatedUserThread) {
    try {
        return result = await userThread.update(
            updatedUserThread,
            {
                where: {
                    userThreadID: userThreadID
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

async function deleteUserThread(userThreadID) {
    try {
        return result = await userThread.destroy({
            where: {
                userThreadID: userThreadID
            }
        });
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getAll,
    getOne,
    create,
    update,
    deleteUserThread,
    findCount,
    findThreadHighlights
};