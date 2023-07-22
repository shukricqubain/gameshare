const db = require('../models/index');
const user = require('../models/user.model');

async function getAll(){
    try{
        return await db.user.findAll({
            raw: true,
        });
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
        console.log(user)
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
    deleteUser
};