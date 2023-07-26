const db = require('../models');
const tokenService = require('../services/token.service');
const Token = db.token;
const Op = db.Sequelize.Op;

// Create and Save a new token
exports.create = async (req) => {
    try{
        let result = await tokenService.create(req);
        return result;
    } catch(err){
        console.log(err)
    }
};

// Get all tokens
exports.findAll = async (req, res) => {
    try{
        let all_tokens = await tokenService.getAll();
        if(all_tokens.length > 0){
            return all_tokens;
        } else {
            return {message: 'No data in token table to fetch.'};
        }
    } catch(err){
        console.log(err);
    }
};

// Get single token by id
exports.findOne = async (req) => {
    try{
        let token = await tokenService.getOne(req);
        if(token == null){
            return 'Cannot find token with specified tokenID';
        } else {
            return token;
        }
    } catch(err){
        console.log(err);
    }
};

// Get single token by username
exports.findUsername = async (username) => {
    try{
        let token = await tokenService.getTokenByUserName(username);
        if(token == null){
            return 'Cannot find token with specified username.';
        } else {
            return token;
        }
    } catch(err){
        console.log(err);
    }
}

// Update a token by their id
exports.update = async (tokenID, token) => {
    try{
        return await tokenService.update(tokenID, token);
    } catch(err){
        console.log(err);
    }
};

// Delete a token by their id
exports.delete = async (tokenID) => {
    try{
        return await tokenService.deleteToken(tokenID);
    } catch(err){
        console.log(err);
    }
};