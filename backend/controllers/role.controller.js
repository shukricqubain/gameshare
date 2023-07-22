const db = require('../models');
const roleService = require('../services/role.service');
const Role = db.role;
const Op = db.Sequelize.Op;

// Create a role
exports.create = async (req, res) => {
    try{
        let result = await roleService.create(req);
        return result;
    } catch(err){
        console.log(err)
    }

};

// Get all roles
exports.findAll = async (req, res) => {
    try{
        let all_roles = await roleService.getAll();
        if(all_roles.length > 0){
            return all_roles;
        } else {
            return {message: 'No data in roles table to fetch.'};
        }
    } catch(err){
        console.log(err);
    }
    
};

// Get single role by id
exports.findOne = async (req, res) => {
    try{
        let role = await roleService.getOne(req);
        if(role == null){
            return 'Cannot find role with specified roleID';
        } else {
            return role;
        }
    } catch(err){
        console.log(err)
    }
};

// Update a role by their id
exports.update = async (req, res) => {
    try{
        return await roleService.update(req.roleID, req.body);
    } catch(err){
        console.log(err);
    }
};

// Delete a role by their id
exports.delete = async (req, res) => {
    try{
        return await roleService.deleteRole(req.roleID);
    } catch(err){
        console.log(err);
    }
};