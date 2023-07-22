const db = require('../models/index');
const role = require('../models/role.model');

async function getAll(){
    try{
        return await db.role.findAll({
            raw: true,
        });
    } catch(err){
        console.log(err)
    }
}
async function create(req){
    try{
        return await db.role.create({
            roleID: req.body.roleID,
            name: req.body.name,
            desc: req.body.desc,
        });
    } catch(err){
        console.log(err)
        if(err.errors[0].type === 'unique violation'){
            return err.errors[0].message;
        }
    }
}

async function getOne(roleID){
    try{
        return await db.role.findOne({
            where: {roleID: roleID},
            raw: true
        });
    } catch(err){

    }
}

async function update(roleID, role){
    try{
        return result = await db.role.update(
            role,
            {
                where:{
                    roleID: roleID
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

async function deleteRole(roleID){
    try{
        return result = await db.role.destroy({
            where:{
                roleID: roleID
            }
        });
    } catch(err){
        console.log(err);
    }
}

module.exports = {
    getAll,
    getOne,
    create,
    update,
    deleteRole
};