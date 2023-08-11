// user.js - User route module.
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const tokenController = require('../controllers/token.controller');
const bcrypt = require('bcrypt');
const user = require('../models/user.model');
const jwt = require('jsonwebtoken');
const secret = '3310969166433653447079416612547342880134738789931871978370073798795133211999047787078905511792111667';

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
            if(typeof user === 'string'){
                return res.status(404).send(user);
            }
            
            //find user token and return
            let token = await tokenController.findUsername(username);
            if(token !== null && token !== 'Cannot find token with specified username.'){
                ///verify token
                jwt.verify(token.token, secret, (err, decoded) => {
                    if (err) {
                        if(err.name === 'TokenExpiredError'){
                            return res.status(401).send({
                                message: 'Session expired.'
                            });
                        } else if(err.name === 'NotBeforeError'){
                            return res.status(401).send({
                                message: 'JWT Not Before Error.'
                            });
                        } else {
                            return res.status(401).send({
                                message: 'JsonWebTokenError'
                            });
                        }
                        
                    } else {
                        return res.status(200).json({
                            message:"Logged in successfully.",
                            userName: user.userName
                        });
                    }
                });

            ///need to check username and password, then generate new token
            } else {
                ///compare the password and the user hash
                bcrypt.compare(password, user.password).then(compare_result => {
                    if(compare_result == true){

                        //generate token
                        try{
                            const token = generateToken(user);
                            return res.status(200).send({
                                message:"Logged in successfully.",
                                userName: username,
                                token: token
                            });
                        } catch(err){
                            return res.status(500).send({
                                message:"Error generating token."
                            });
                        }
                        
                    } else {
                        return res.status(400).json({
                            message:"Either the password or username is incorrect."
                        });
                    }
                }).catch(err => console.error(err.message));
            }

        } else if(req.body.username == undefined){
            return res.status(400).json({
                message:"The username is required."
            });
        } else if(req.body.password == undefined){
            return res.status(400).json({
                message:"The password is required."
            });
        }
    
    } catch(err){
        return res.status(500).json({
            message:"There was an error when trying to login a user.",
            err
        });
    }
    
});

router.post('/checkUserIsLoggedIn', async function(req, res){
    try{
        if(req.body.userName !== undefined){
            let userName = req.body.userName;
            //find user token and return
            let token = await tokenController.findUsername(userName);
            if(token !== null && token !== 'Cannot find token with specified username.'){
                ///verify token
                jwt.verify(token.token, secret, (err, decoded) => {
                    if (err) {
                        if(err.name === 'TokenExpiredError'){
                            res.status(200).send({
                                message: 'Session expired.'
                            });
                        } else if(err.name === 'NotBeforeError'){
                            res.status(401).send({
                                message: 'JWT Not Before Error.'
                            });
                        } else {
                            res.status(401).send({
                                message: 'JsonWebTokenError'
                            });
                        }
                    } else {
                        res.status(200).send({
                            message:"Logged in successfully.",
                            userName: userName
                        });
                    }
                });
            } else {
                res.status(200).send({
                    message:"Token is null.",
                });
            }
        } else if(req.body.username == undefined){
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
router.post('/allUsers', async function(req, res) {
    try{
        if(req.body !== null){
            let searchCriteria = req.body;
            let all_users;
            let user_count;
            if(searchCriteria.pagination){
                console.log(searchCriteria)
                user_count = await userController.findCount(searchCriteria);
                console.log(user_count)
                searchCriteria.user_count = user_count;
                all_users = await userController.findAll(searchCriteria);
                console.log(all_users)
                if(all_users.message !== 'No data in user table to fetch.'){
                    searchCriteria.data = all_users;
                    return res.status(200).json(searchCriteria);
                } else {
                    return res.status(204).json(all_users.message);
                }
            } else {
                all_users = await userController.findAll(searchCriteria);
                user_count = all_users.length;
                if(all_users.message !== 'No data in user table to fetch.'){
                    searchCriteria.data = all_users;
                    return res.status(200).json(searchCriteria);
                } else {
                    return res.status(204).json(all_users);
                }
            }
        } else {
            res.status(400).send('Search criteria is required.');
        }
    } catch(err){
        console.log(err)
    }
});

// Todo add token functionality to check that the user call this request has the priviledge.
// get a single user by their userID
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
// get a single user by their username
router.get('/singleUserByName/:userName', async function(req, res){
    try{
        if(req.params.userName !== undefined){
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
                message:"The userID is required to update a user."
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

async function generateToken(user){
    try{
        const token = jwt.sign(
            { data: `${user.userName}`}, 
            '3310969166433653447079416612547342880134738789931871978370073798795133211999047787078905511792111667', 
            { expiresIn: '4h' }
            

        );
        const token_obj = {
            token: token,
            userName: user.userName
        }
        await tokenController.create(token_obj);
        return token;
    } catch(err){
        console.log(err);
    }
}

module.exports = router;