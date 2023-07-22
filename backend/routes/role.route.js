// role.route.js - Role route module.

const express = require("express");
const router = express.Router();
const rolesController = require("../controllers/role.controller");


// get all users 
router.get('/allRoles', async function(req, res) {
    try{
        let all_roles = await rolesController.findAll();
        if(all_roles.message !== 'No data in roles table to fetch.'){
            res.status(200).send(all_roles)
        } else {
            res.status(204).send(all_roles);
        }
    } catch(err){
        console.log(err)
    }
});

// get a single role by their roleID
router.get('/getRole/:roleID', async function(req, res){
    try{
        if(req.params.roleID !== undefined){
            let roleID = Number(req.params.roleID);
            let role = await rolesController.findOne(roleID);
            if(role !== undefined && typeof role !== 'string'){
                res.status(200).send(role);
            } else {
                res.status(404).send(role);
            }
        } else {
            res.status(400).send('Role ID is required.');
        }
    } catch(err){
        console.log(err);
    }
});

// create a role
router.post('/addRole', async function(req, res){
    try{
        let result = await rolesController.create(req);
        if(typeof result === 'string' ){
            res.status(403).send(result);
        } else {
            res.status(200).send(result);
        }
    }catch(err){
        console.log(err)
    }

});

// edit a role by roleID
router.put('/editRole/:roleID', async function(req, res){
    try{
        if(req.params.roleID !== undefined && req.body !== undefined){
            let roleID = Number(req.params.roleID);
            let result = await rolesController.update({roleID: roleID, body: req.body});
            if(typeof result === 'string' ){
                res.status(403).send(result);
            } else if(result[0] == 1){
                res.status(200).send('Role updated successfully.');
            } else {
                res.status(503).send('Role was not updated successfully.');
            }
        } else {
            res.status(400).send('Role ID and update object is required.');
        }
    } catch(err){
        console.log(err);
    }
});

// delete a role by roleID
router.delete('/deleteRole/:roleID', async function(req, res){
    try{
        if(req.params.roleID !== undefined){
            let roleID = Number(req.params.roleID);
            let result = await rolesController.delete({roleID: roleID});
            console.log(result);
            if(result == 1){
                res.status(200).send('Role was deleted successfully.');
            } else {
                res.status(503).send('Role was not deleted successfully.');
            }
        } else {
            res.status(400).send('Role ID is required to delete a role.')
        }
    } catch(err){
        console.log(err);
    }
});

module.exports = router;