// user.js - User route module.
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const bcrypt = require('bcrypt');
const user = require('../models/user.model');
const jwt = require('jwt-simple');

// sign up user
router.post('/signupUser', async function(req, res){
    try{
        const saltRounds = 10;
        const user = req.body;
        const password = req.body.password;
        /// generate salt
        const salt = await bcrypt.genSalt(saltRounds).then(salt => {
            return salt;
        }).catch(err => console.error(err.message));
        /// generate hash
        const hash = await bcrypt.hash(password, salt).then(hash => {
            return hash;
        }).catch(err => console.error(err.message));
        user.password = hash;
        ///create new user
        let newUser = await userController.create(user);
        if(typeof newUser === 'string'){
            res.status(403).send(newUser);
        } else {
            newUser = newUser['dataValues'];
            const token = generateToken(newUser);
            console.log(token)
            res.status(201).json({
                created_user: newUser,
                token: token,
                user_id: newUser.userID
            });
        }
    } catch(err){
        res.status(500).json({
            message:"There was an error adding a user to the database.",
            err
        });
    }
});

// login a user
router.post('/loginUser', async function(req,res){
    try {
        if(req.body.username !== undefined && req.body.password !== undefined){
            const username = req.body.username;
            const password = req.body.password;
            //find user by username
            const user = await userController.findUsername(username);
            if(user == undefined || typeof user === 'string'){
                res.status(404).send(user);
            }
            console.log(user)
            ///compare the password and the user hash
            bcrypt.compare(password, user.password).then(compare_result => {
                if(compare_result == true){
                    res.status(200).send({
                        message:"Logged in successfully.",
                        user: user
                    });
                } else {
                    res.status(400).json({
                        message:"Either the password or username is incorrect."
                    });
                }
            }).catch(err => console.error(err.message));
        } else if(req.body.username == undefined){
            res.status(400).json({
                message:"The password is required."
            });
        } else if(req.body.password == undefined){
            res.status(400).json({
                message:"The username is required."
            });
        }
    
    } catch(err){
        res.status(500).json({
            message:"There was an error when trying to login a user.",
            err
        });
    }
    
});

// Todo add token functionality to check that the user call this request has the priviledge.
// get all users 
router.get('/allUsers', async function(req, res) {
    try{
        let all_users = await userController.findAll();
        if(all_users.message !== 'No data in user table to fetch.'){
            res.status(200).send(all_users);
        } else {
            res.status(204).send(all_users);
        }
    } catch(err){
        console.log(err)
    }
});

// Todo add token functionality to check that the user call this request has the priviledge.
// get a single user app by their userID
router.get('/singleUser/:userID', async function(req, res){
    try{
        if(req.params.userID !== undefined){
            let userID = Number(req.params.userID);
            let user = await userController.findOne(userID);
            if(user !== undefined && typeof user !== 'string'){
                res.status(200).send(user);
            } else {
                res.status(404).send(user);
            }
        } else {
            res.status(400).send('User ID is required.');
        }
    } catch(err){
        console.log(err);
    }
});

// Todo add token functionality to check that the user call this request has the priviledge.
// get a single user app by their username
router.get('/singleUserByName/:userName', async function(req, res){
    try{
        if(req.body.userName !== undefined){
            let userName = req.params.userName;
            let user = await userController.findUsername(userName);
            if(user !== undefined && typeof user !== 'string'){
                res.status(200).send(user);
            } else {
                res.status(404).send(user);
            }
        } else {
            res.status(400).send('Username is required.');
        }
    } catch(err){
        console.log(err);
    }
});

// Todo add token functionality to check that the user call this request has the priviledge.
// edit a user by userID
router.put('/editUser', async function(req, res){
    try{
        if(req.body.userID !== undefined){
            const userID = req.body.userID;
            let user = await userController.findOne(userID);
            if(user == undefined || typeof user === 'string'){
                res.status(404).send(user);
            }
            
            ///if password is being updated we need to salt and hash it
            if(req.body.password !== undefined){
                let password = req.body.password;
                const saltRounds = 10;
                /// generate salt
                const salt = await bcrypt.genSalt(saltRounds).then(salt => {
                    return salt;
                }).catch(err => console.error(err.message));
                /// generate hash
                const hash = await bcrypt.hash(password, salt).then(hash => {
                    return hash;
                }).catch(err => console.error(err.message));
                //user.password = hash;
                req.body.password = hash;
            }
            ///update user
            //let updatedUser = await userController.update(userID,user);
            let updatedUser = await userController.update(userID,req.body);
            
            if(typeof updatedUser === 'string'){
                res.status(403).send(updatedUser);
            } else if(updatedUser[0] == 1){ 
                res.status(200).json({
                    message: "The user was updated successfully.",
                    user_id: updatedUser.userID
                });
            } else {
                res.status(503).send('User was not updated successfully.');
            }
        } else {
            res.status(400).json({
                message:"The userID is required to update an employee."
            });
        }
    } catch(err){
        res.status(500).json({
            message:"There was an error when trying to edit a user.",
            err
        });
    }
});

// Todo add token functionality to check that the user call this request has the priviledge.
// delete a user by userID
router.delete('/deleteUser/:userID', async function(req, res){
    try{
        if(req.params.userID !== undefined){
            let userID = Number(req.params.userID);
            let result = await userController.delete(userID);
            if(result == 1){
                res.status(200).json({
                    message:`User with ID: ${userID} has been deleted successfully.`}
                );
            } else {
                res.status(503).send('User was not deleted successfully.');
            }
        } else {
            res.status(400).send('User ID is required.');
        }
    }catch(err){
        res.status(500).json({
            message:"There was an error when trying to delete a user.",
            err
        });
    }
});

function generateToken(user){
    const payload = {
        userid: user.userID,
        firstName: user.firstName
    };
    const secret = 'TU0GFSR2RWCGK7FQ25VXNB58U37SWGJK2B4BQZU3VAP8YMYYJPICIEKQPAEVK1ZABQOA5XLTQPJ93Y8KI6UWRDDR9AZEH86V9CZ9LPI0TDVUHL180TGEP8IUWGT3JYGLFTWCUBL1RJ3XDPM0';
    const token = jwt.encode(payload, secret);
    return token;
}

module.exports = router;