const db = require('../models/index');

async function getAll(){
    try{
        return await db.token.findAll({
            raw: true,
        });
    } catch(err){
        console.log(err)
    }
}

async function create(token){
    try{
        return await db.token.create({
            tokenID: token.tokenID,
            token: token.token,
            userName: token.userName,
        });
    } catch(err){
        console.log(err)
        if(err.errors[0].type === 'unique violation'){
            return err.errors[0].message;
        }
    }
}

async function getOne(tokenID){
    try{
        return await db.token.findOne({
            where: {tokenID: tokenID},
            raw: true
        });
    } catch(err){
        console.log(err);
    }
}

async function getTokenByUserName(username){
    try{
        return await db.token.findOne({
            where: {userName: username},
            raw: true
        });
    } catch(err){
        console.log(err);
    }
}

async function update(tokenID, token){
    try{
        return result = await db.token.update(
            token,
            {
                where:{
                    tokenID: tokenID
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

async function deleteToken(tokenID){
    try{
        return result = await db.token.destroy({
            where:{
                tokenID: tokenID
            }
        });
    } catch(err){
        console.log(err);
    }
}

module.exports = {
    getAll,
    getOne,
    getTokenByUserName,
    create,
    update,
    deleteToken
};