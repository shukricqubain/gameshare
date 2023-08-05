const db = require('../models');
const userService = require('../services/user.service');
const User = db.user;
const Op = db.Sequelize.Op;

// Create and Save a new User
exports.create = async (req, res) => {
    try{
        let result = await userService.create(req);
        return result;
    } catch(err){
        console.log(err)
    }
};

// Get all users
exports.findCount = async (searchCriteria) => {
    try{
        let userCount = await userService.findCount(searchCriteria);
        if(userCount > 0){
            return userCount;
        } else {
            return {message: 'No data in user table to fetch.'};
        }
    } catch(err){
        console.log(err);
    }
};

// Get all users
exports.findAll = async (searchCriteria) => {
    try{
        let all_users = await userService.getAll(searchCriteria);
        if(all_users.length > 0){
            return all_users;
        } else {
            return {message: 'No data in user table to fetch.'};
        }
    } catch(err){
        console.log(err);
    }
};

// Get single user by id
exports.findOne = async (req) => {
    try{
        let user = await userService.getOne(req);
        if(user == null){
            return 'Cannot find user with specified userID';
        } else {
            return user;
        }
    } catch(err){
        console.log(err);
    }
};

// Get single user by username
exports.findUsername = async (username) => {
    try{
        let user = await userService.getUserByUserName(username);
        if(user == null){
            return 'Cannot find user with specified username';
        } else {
            return user;
        }
    } catch(err){
        console.log(err);
    }
}

// Update a user by their id
exports.update = async (userID, user) => {
    try{
        return await userService.update(userID, user);
    } catch(err){
        console.log(err);
    }
};

// Delete a user by their id
exports.delete = async (userID) => {
    try{
        return await userService.deleteUser(userID);
    } catch(err){
        console.log(err);
    }
};