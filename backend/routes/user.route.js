// user.js - User route module.
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const tokenController = require('../controllers/token.controller');
const bcrypt = require('bcrypt');
const user = require('../models/user.model');
const tokenUtility = require('../utility/token');

// sign up user
router.post('/signupUser', async function (req, res) {
    try {
        const saltRounds = 10;
        const user = req.body;
        const password = req.body.userPassword;
        /// generate salt
        const salt = await bcrypt.genSalt(saltRounds).then(salt => {
            return salt;
        }).catch(err => console.error(err.message));
        /// generate hash
        const hash = await bcrypt.hash(password, salt).then(hash => {
            return hash;
        }).catch(err => console.error(err.message));
        user.userPassword = hash;
        ///create new user
        let newUser = await userController.create(user);
        if (typeof newUser === 'string') {
            res.status(403).send(newUser);
        } else {
            if (newUser[1] == 1) {
                let userID = newUser[0];
                let addedUser = await userController.findOne(userID);
                const token = tokenUtility.generateToken(addedUser);
                res.status(201).json({
                    created_user: addedUser,
                    token: token,
                    user_id: addedUser.userID
                });
            } else {
                res.status(500).json({
                    message: "There was an error adding a user to the database.",
                    err
                });
            }

        }
    } catch (err) {
        res.status(500).json({
            message: "There was an error adding a user to the database.",
            err
        });
    }
});

// login a user
router.post('/loginUser', async function (req, res) {
    try {
        if (req.body.username !== undefined && req.body.password !== undefined) {
            const username = req.body.username;
            const password = req.body.password;
            //find user by username
            const user = await userController.findUsername(username);
            if (typeof user === 'string') {
                return res.status(404).send(user);
            }
            //find user token and return
            let token = await tokenController.findUsername(username);
            if (token !== null && token !== 'Cannot find token with specified username.') {
                ///verify token
                let result = await tokenUtility.verifyToken(token);
                if (result.returnString === 'TokenExpiredError') {
                    let result = await tokenController.delete(token.tokenID);
                    if (result == 1) {
                        return res.status(200).json({
                            message: 'Token deleted, reload login.'
                        });
                    } else {
                        return res.status(500).json({
                            message: 'Error deleting token.'
                        });
                    }
                } else if (result.returnString === 'JsonWebTokenError') {
                    return res.status(401).send({
                        message: 'JsonWebTokenError'
                    });
                } else if (result.returnString === 'Logged in successfully.') {
                    return res.status(200).send({
                        message: "Logged in successfully.",
                        userName: username,
                        token: token.token,
                        roleID: result.roleID
                    });
                }
                ///need to check username and password, then generate new token
            } else {
                ///compare the password and the user hash
                bcrypt.compare(password, user.userPassword).then(async compare_result => {
                    if (compare_result == true) {

                        //generate token
                        try {
                            const token = await tokenUtility.generateToken(user);
                            return res.status(200).send({
                                message: "Logged in successfully.",
                                userName: username,
                                token: token,
                                roleID: user.userRole
                            });
                        } catch (err) {
                            return res.status(500).send({
                                message: "Error generating token."
                            });
                        }

                    } else {
                        return res.status(400).json({
                            message: "Either the password or username is incorrect."
                        });
                    }
                }).catch(err => console.error(err.message));
            }

        } else if (req.body.username == undefined) {
            return res.status(400).json({
                message: "The username is required."
            });
        } else if (req.body.password == undefined) {
            return res.status(400).json({
                message: "The password is required."
            });
        }

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "There was an error when trying to login a user.",
            err
        });
    }

});

router.post('/checkUserIsLoggedIn', async function (req, res) {
    try {
        if (req.body.userName !== undefined) {
            let userName = req.body.userName;
            //find user token and return
            let token = await tokenController.findUsername(userName);
            /// if token doesn't exist, log user out
            if (token === 'Cannot find token with specified username.') {
                return res.status(401).send({
                    message: `Token doesn't exist, please login again.`
                });
            }
            ///decode token to get result and roleID
            if (token !== null && token !== 'Cannot find token with specified username.') {
                let result = await tokenUtility.verifyToken(token);
                if (result.returnString === 'Token deleted, reload login.') {
                    return res.status(200).json({
                        message: 'Token deleted, reload login.'
                    });
                } else if (result.returnString === 'Error deleting token.') {
                    return res.status(500).json({
                        message: 'Error deleting token.'
                    });
                } else if (result.returnString === 'JsonWebTokenError') {
                    return res.status(401).send({
                        message: 'JsonWebTokenError'
                    });
                } else if (result.returnString === 'Logged in successfully.') {
                    return res.status(200).send({
                        message: "Logged in successfully.",
                        userName: userName,
                        token: token.token,
                        roleID: result.roleID
                    });
                }
            } else {
                return res.status(200).send({
                    message: "Token is null.",
                });
            }
        } else if (req.body.username == undefined) {
            return res.status(400).json({
                message: "The username is required."
            });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "There was an error when trying to login a user.",
            err
        });
    }
});

// Todo add token functionality to check that the user call this request has the priviledge.
// get all users 
router.post('/allUsers', async function (req, res) {
    try {
        if (req.body !== null) {
            let searchCriteria = req.body;
            let all_users;
            let user_count;
            if (searchCriteria.pagination === 'true') {
                user_count = await userController.findCount(searchCriteria);
                searchCriteria.user_count = user_count;
                all_users = await userController.findAll(searchCriteria);
                if (all_users.message !== 'No data in user table to fetch.') {
                    searchCriteria.data = all_users;
                    return res.status(200).json(searchCriteria);
                } else {
                    return res.status(200).send({ message: 'No data in user table to fetch.' });
                }
            } else {
                all_users = await userController.findAll(searchCriteria);
                user_count = all_users.length;
                if (all_users.message !== 'No data in user table to fetch.') {
                    searchCriteria.data = all_users;
                    return res.status(200).json(searchCriteria);
                } else {
                    return res.status(200).send({ message: 'No data in user table to fetch.' });
                }
            }
        } else {
            res.status(400).send('Search criteria is required.');
        }
    } catch (err) {
        console.log(err)
    }
});

// Todo add token functionality to check that the user call this request has the priviledge.
// get a single user by their userID
router.get('/singleUser/:userID', async function (req, res) {
    try {
        if (req.params.userID !== undefined) {
            let userID = Number(req.params.userID);
            let user = await userController.findOne(userID);
            if (user !== undefined && typeof user !== 'string') {
                res.status(200).send(user);
            } else {
                res.status(404).send(user);
            }
        } else {
            res.status(400).send('User ID is required.');
        }
    } catch (err) {
        console.log(err);
    }
});

// get a single user by their username
router.get('/singleUserByName/:userName', async function (req, res) {
    try {
        if (req.params.userName !== undefined) {
            let userName = req.params.userName;
            let user = await userController.findUsername(userName);
            if (user !== undefined && typeof user !== 'string') {
                res.status(200).send(user);
            } else {
                res.status(404).send(user);
            }
        } else {
            res.status(400).send('Username is required.');
        }
    } catch (err) {
        console.log(err);
    }
});

// check user exists for signup purposes
router.get('/checkUserExists/:userName', async function (req, res) {
    try {
        if (req.params.userName !== undefined) {
            let userName = req.params.userName;
            let user = await userController.findUsername(userName);
            if (user !== undefined && user === 'Cannot find user with specified username') {
                return res.status(200).send({ message: 'Cannot find user with specified username.' });
            } else {
                return res.status(200).send({ message: 'User with this username already exists in Gameshare.' });
            }
        } else {
            return res.status(400).send({ message: 'Username is required.' });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "There was an error when trying check a user exists.",
            err
        });
    }
});

// Todo add token functionality to check that the user call this request has the priviledge.
// edit a user by userID
router.put('/editUser', async function (req, res) {
    try {
        if (req.body.userID !== undefined) {
            const userID = req.body.userID;
            let user = await userController.findOne(userID);

            if (user == undefined || typeof user === 'string') {
                res.status(404).send(user);
            }

            ///check if both are not hashes, so the potentially changed password is hashed properly when sent to the db
            if(user.userPassword != undefined && req.body.userPassword != undefined && user.userPassword != req.body.userPassword){
                
                let password = req.body.userPassword;
                const saltRounds = 10;
                /// generate salt
                const salt = await bcrypt.genSalt(saltRounds).then(salt => {
                    return salt;
                }).catch(err => console.error(err.message));
                /// generate hash
                const hash = await bcrypt.hash(password, salt).then(hash => {
                    return hash;
                }).catch(err => console.error(err.message));
                req.body.userPassword = hash;

            }

            ///if roleID is being updated we need to update the token
            if (req.body.userRole != undefined && user.userRole != undefined && req.body.userRole != user.userRole) {
                user.userRole = req.body.userRole;
                await tokenUtility.updateToken(user);
            }

            ///update user
            //let updatedUser = await userController.update(userID,user);
            let updatedUser = await userController.update(userID, req.body);
            if (typeof updatedUser === 'string') {
                res.status(403).send(updatedUser);
            } else if (updatedUser !== undefined) {
                res.status(200).json({
                    message: "The user was updated successfully.",
                    user_id: req.body.userID
                });
            } else {
                res.status(503).send('User was not updated successfully.');
            }

        } else {
            res.status(400).json({
                message: "The userID is required to update a user."
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "There was an error when trying to edit a user.",
            err
        });
    }
});

// Todo add token functionality to check that the user call this request has the priviledge.
// delete a user by userID
router.delete('/deleteUser/:userID', async function (req, res) {
    try {
        if (req.params.userID !== undefined) {
            let userID = Number(req.params.userID);
            let result = await userController.delete(userID);
            if (result == 1) {
                res.status(200).json({
                    message: `User with ID: ${userID} has been deleted successfully.`
                }
                );
            } else {
                res.status(503).send('User was not deleted successfully.');
            }
        } else {
            res.status(400).send('User ID is required.');
        }
    } catch (err) {
        res.status(500).json({
            message: "There was an error when trying to delete a user.",
            err
        });
    }
});

module.exports = router;