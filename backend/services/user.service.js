const db = require('../models/index');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

async function findCount(searchCriteria){
    try{
        let sort = searchCriteria.sort;
        let sortDirection = searchCriteria.direction;
        let searchTerm = searchCriteria.searchTerm;
        let users;
        if(searchTerm !== ''){
            users = await db.user.findAll({
                where: {
                    userID: {[Op.like]: '%' + searchTerm + '%'}, 
                    userName: {[Op.like]: '%' + searchTerm + '%'},
                    userRole: {[Op.like]: '%' + searchTerm + '%'},
                    email: {[Op.like]: '%' + searchTerm + '%'}
                },
                order: [
                    [sort, sortDirection],
                    ['userName', 'ASC'],
                ],
                attributes: ['userID'],
                raw: true,
            });
        } else {
            users = await db.user.findAll({
                order: [
                    [sort, sortDirection],
                    ['userName', 'ASC'],
                ],
                attributes: ['userID'],
                raw: true,
            });
        }
        return users.length;
    } catch(err){
        console.log(err)
    }
}

async function getAll(searchCriteria){
    try{
        let sort = searchCriteria.sort;
        let sortDirection = searchCriteria.direction;
        let pagination = searchCriteria.pagination;
        let searchTerm = searchCriteria.searchTerm;
        let limit;
        let offset;
        let page = searchCriteria.page;
        if(searchTerm !== ''){
            if(pagination){
                limit = searchCriteria.limit;
                if(page != 0){
                    offset = page * limit;
                    return await db.user.findAll({
                        where: {
                            userID: {[Op.like]: '%' + searchTerm + '%'}, 
                            userName: {[Op.like]: '%' + searchTerm + '%'},
                            userRole: {[Op.like]: '%' + searchTerm + '%'},
                            email: {[Op.like]: '%' + searchTerm + '%'}
                        },
                        order: [
                            [sort, sortDirection],
                            ['userName', 'ASC'],
                        ],
                        limit: limit,
                        offset: offset,
                        attributes: ['userID', 'userName', 'firstName', 'lastName', 'dateOfBirth', 'email', 'phoneNumber', 'userRole', 'password', 'createdAt', 'updatedAt'],
                        raw: true,
                    });
                } else {
                    return await db.user.findAll({
                        where: {
                            userID: {[Op.like]: '%' + searchTerm + '%'}, 
                            userName: {[Op.like]: '%' + searchTerm + '%'},
                            userRole: {[Op.like]: '%' + searchTerm + '%'},
                            email: {[Op.like]: '%' + searchTerm + '%'}
                        },
                        order: [
                            [sort, sortDirection],
                            ['userName', 'ASC'],
                        ],
                        limit: limit,
                        attributes: ['userID', 'userName', 'firstName', 'lastName', 'dateOfBirth', 'email', 'phoneNumber', 'userRole', 'password', 'createdAt', 'updatedAt'],
                        raw: true,
                    });
                }
            } else {
                return await db.user.findAll({
                    where: {
                        userID: {[Op.like]: '%' + searchTerm + '%'}, 
                        userName: {[Op.like]: '%' + searchTerm + '%'},
                        userRole: {[Op.like]: '%' + searchTerm + '%'},
                        email: {[Op.like]: '%' + searchTerm + '%'}
                    },
                    order: [
                        [sort, sortDirection],
                        ['userName', 'ASC'],
                    ],
                    attributes: ['userID', 'userName', 'firstName', 'lastName', 'dateOfBirth', 'email', 'phoneNumber', 'userRole', 'password', 'createdAt', 'updatedAt'],
                    raw: true,
                });
            }
        } else {
            if(pagination){
                limit = searchCriteria.limit;
                if(page != 0){
                    offset = page * limit;
                    return await db.user.findAll({
                        order: [
                            [sort, sortDirection],
                            ['userName', 'ASC'],
                        ],
                        limit: limit,
                        offset: offset,
                        attributes: ['userID', 'userName', 'firstName', 'lastName', 'dateOfBirth', 'email', 'phoneNumber', 'userRole', 'password', 'createdAt', 'updatedAt'],
                        raw: true,
                    });
                } else {
                    return await db.user.findAll({
                        order: [
                            [sort, sortDirection],
                            ['userName', 'ASC'],
                        ],
                        limit: limit,
                        attributes: ['userID', 'userName', 'firstName', 'lastName', 'dateOfBirth', 'email', 'phoneNumber', 'userRole', 'password', 'createdAt', 'updatedAt'],
                        raw: true,
                    });
                }
            } else {
                return await db.user.findAll({
                    order: [
                        [sort, sortDirection],
                        ['userName', 'ASC'],
                    ],
                    attributes: ['userID', 'userName', 'firstName', 'lastName', 'dateOfBirth', 'email', 'phoneNumber', 'userRole', 'password', 'createdAt', 'updatedAt'],
                    raw: true,
                });
            }
        }

    } catch(err){
        console.log(err)
    }
}
async function create(user){
    try{
        return await db.user.create({
            userID: user.userID,
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            dateOfBirth: user.dateOfBirth,
            email: user.email,
            phoneNumber: user.phoneNumber,
            userRole: user.userRole,
            password: user.password
        });
    } catch(err){
        console.log(err)
        if(err.errors[0].type === 'unique violation'){
            return err.errors[0].message;
        }
    }
}

async function getOne(userID){
    try{
        return await db.user.findOne({
            where: {userID: userID},
            raw: true
        });
    } catch(err){
        console.log(err);
    }
}

async function getUserByUserName(username){
    try{
        return await db.user.findOne({
            where: {userName: username},
            raw: true
        });
    } catch(err){
        console.log(err);
    }
}

async function update(userID, user){
    try{
        return result = await db.user.update(
            user,
            {
                where:{
                    userID: userID
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

async function deleteUser(userID){
    try{
        return result = await db.user.destroy({
            where:{
                userID: userID
            }
        });
    } catch(err){
        console.log(err);
    }
}

module.exports = {
    getAll,
    getOne,
    getUserByUserName,
    create,
    update,
    deleteUser,
    findCount
};