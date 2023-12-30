const express = require("express");
const router = express.Router();
const userGameController = require("../controllers/userGame.controller");
const userAchievementController = require("../controllers/userAchievement.controller");
const achievementController = require('../controllers/achievement.controller');
const db = require('../models/index');

// create a userGame
router.post('/addUserGame', async function (req, res) {
    try {
        ///check if userGame already in user's collection
        let userGame = await userGameController.findOneByUserIDAndGameID(req.body);
        if (userGame === 'Cannot find game with specified userID and GameID') {

            ///create new userGame
            let newUserGame;
            try {
                newUserGame = await userGameController.create(req.body);
                if (typeof newUserGame === 'string') {
                    res.status(403).send(newUserGame);
                }
            } catch (err) {
                console.error(err);
                res.status(500).json({
                    message: "There was an error when creating a new userGame.",
                    err
                });
            }

            ///check userAchievements for this game
            let userAchievements;
            try {
               userAchievements = await userAchievementController.findAllAchievementsByGameID(req.body);
            } catch(err){
                console.error(err);
                res.status(500).json({
                    message: "There was an error when fetching userAchievements for the new userGame.",
                    err
                });
            }

            ///get all achievements for this game
            let gameAchievements;
            try {
                gameAchievements = await achievementController.findByGameID(req.body.gameID);
            } catch(err){
                console.error(err);
                res.status(500).json({
                    message: "There was an error when fetching all gameAchievements for the new userGame.",
                    err
                });
            }

            ///add userAchievements for this game
            for (let achievement of gameAchievements) {

                ///check if there any userAchievements for this game already
                if(userAchievements.message !== undefined){
                    try {
                        db.userAchievement.create({
                            achievementID: achievement.achievementID,
                            achievementName: achievement.achievementName,
                            gameID: achievement.gameID,
                            gameName: achievement.gameName,
                            userID: req.body.userID,
                            achievementStatus: 'Not Started'
                        });
                    } catch (err) {
                        console.error(err);
                        res.status(500).json({
                            message: "There was an error when bulk creating userAchievements for the new userGame.",
                            err
                        });
                    }
                } else {
                    //check if user already has the current achievement in thier collection
                    let userAchievement = userAchievements.find(obj => obj.achievementID == achievement.achievementID);
                    ///add achievement to user's collection
                    if (userAchievement == undefined) {
                        try {
                            db.userAchievement.create({
                                achievementID: achievement.achievementID,
                                achievementName: achievement.achievementName,
                                gameID: achievement.gameID,
                                gameName: achievement.gameName,
                                userID: req.body.userID,
                                achievementStatus: 'Not Started'
                            });
                        } catch (err) {
                            console.error(err);
                            res.status(500).json({
                                message: "There was an error when bulk creating userAchievements for the new userGame.",
                                err
                            });
                        }
                    }
                }
            }
            newUserGame = newUserGame['dataValues'];
            res.status(201).json({
                newGame: newUserGame
            });
        } else {
            res.status(400).send('Cannot add userGame! Game is already in collection.');
        }
    } catch (err) {
        res.status(500).send("There was an error adding a userGame to the database.");
    }
});

// get all userGames
router.post('/allUserGames', async function (req, res) {
    try {
        if (req.body !== null) {
            let searchCriteria = req.body;
            let allUserGames;
            let userGameCount;
            if (searchCriteria.pagination === 'true') {
                userGameCount = await userGameController.findCount(searchCriteria);
                if (userGameCount > 0) {
                    searchCriteria.gameCount = userGameCount;
                    allUserGames = await userGameController.findAll(searchCriteria);
                    if (allUserGames.message !== 'No data in userGame table to fetch.') {
                        searchCriteria.data = allUserGames;
                        return res.status(200).json(searchCriteria);
                    } else {
                        return res.status(200).json('No data in userGame table to fetch.');
                    }
                } else {
                    return res.status(200).json('No data in userGame table to fetch.');
                }
            } else {
                allUserGames = await userGameController.findAll(searchCriteria);
                console.log(allUserGames)
                userGameCount = allUserGames.length;
                if (allUserGames.message !== 'No data in userGame table to fetch.') {
                    searchCriteria.data = allUserGames;
                    return res.status(200).json(searchCriteria);
                } else {
                    console.log('no data')
                    return res.status(200).json('No data in userGame table to fetch.');
                }
            }
        } else {
            res.status(400).json('Search criteria is required.');
        }
    } catch (err) {
        console.log(err)
    }
});

// get a single userGame by their userGameID
router.get('/singleUserGame/:userGameID', async function (req, res) {
    try {
        if (req.params.userGameID !== undefined) {
            let userGameID = Number(req.params.userGameID);
            let userGame = await userGameController.findOne(userGameID);
            if (userGame !== undefined && typeof userGame !== 'string') {
                res.status(200).send(userGame);
            } else {
                res.status(404).send(userGame);
            }
        } else {
            res.status(400).send('UserGameID is required.');
        }
    } catch (err) {
        console.log(err);
    }
});

// edit a userGame by userGameID
router.put('/editUserGame', async function (req, res) {
    try {
        if (req.body.userGameID !== undefined) {
            const userGameID = req.body.userGameID;
            let userGame = await userGameController.findOne(userGameID);
            if (userGame == undefined || typeof userGame === 'string') {
                return res.status(404).send(userGame);
            }

            ///update userGame
            let updatedUserGame = await userGameController.update(userGameID, req.body);
            if (typeof updatedUserGame === 'string') {
                return res.status(403).send(updatedUserGame);
            } else if (updatedUserGame[0] == 1) {
                return res.status(200).json({
                    message: "The userGame was updated successfully.",
                    userGameID: updatedUserGame.userGameID
                });
            } else {
                return res.status(503).send('UserGame was not updated successfully.');
            }
        } else {
            return res.status(400).json({
                message: "The userGameID is required to update a userGame."
            });
        }
    } catch (err) {
        return res.status(500).json({
            message: "There was an error when trying to edit a userGame.",
            err
        });
    }
});

// delete a userGame by userGameID
router.delete('/deleteUserGame/:userGameID', async function (req, res) {
    try {
        if (req.params.userGameID !== undefined) {

            let userGameID = Number(req.params.userGameID);

            ///check userGame exists
            let userGame;
            try {
                userGame = await userGameController.findOne(userGameID);
            } catch(err){
                res.status(400).send('No UserGame was found to be deleted.');
            }

            ///delete userGame from user collection
            let result = await userGameController.delete(userGameID);

            ///get achievements for this game
            let achievements = await achievementController.findByGameID(userGame.gameID);

            ///check there are userAchievements for this game
            let userAchievements = await userAchievementController.findAllAchievementsByGameID(userGame);

            ///delete userAchievements for the userGame
            let achievementResults;
            if(userAchievements != undefined && userAchievements.length > 0){
                try {
                    achievementResults = await userAchievementController.bulkDelete(userGame.userID, userGame.gameID);
                    if (result == 1) {
                        res.status(200).json({
                            message: `UserGame with ID: ${userGameID} has been deleted successfully.
                            ${achievementResults} of ${userAchievements} user achievements has been deleted successfully.`
                        }
                        );
                    } else {
                        res.status(503).send('UserGame was not deleted successfully.');
                    }
                } catch(err){
                    console.error('Error bulk deleting userAchievements.');
                }
            ///case where there are no achievements
            } else {

                if (result == 1) {
                    res.status(200).json({
                        message: `UserGame with ID: ${userGameID} has been deleted successfully.`
                    }
                    );
                } else {
                    res.status(503).send('UserGame was not deleted successfully.');
                }
            }
        } else {
            res.status(400).send('UserGameID is required.');
        }
    } catch (err) {
        res.status(500).json({
            message: "There was an error when trying to delete a userGame.",
            err
        });
    }
});

module.exports = router;