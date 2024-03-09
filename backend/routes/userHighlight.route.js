const express = require("express");
const router = express.Router();
const userGameController = require("../controllers/userGame.controller");
const userAchievementController = require("../controllers/userAchievement.controller");
const achievementController = require('../controllers/achievement.controller');
const db = require('../models/index');

router.get('/getUserHighlights/:userID', async function (req, res){
    try {
        if (req.params.userID !== undefined) {
            let userID = Number(req.params.userID);

            ///fetch userGames
            let userGameHighlights; 
            try {
                userGameHighlights = await userGameController.findGameHighlights(userID);
            } catch(err){
                console.error(err);
                res.status(500).json({
                    message: "There was an error when fetching userGames for the userHighlights.",
                    err
                });
            }

            if(userGameHighlights.length == 0){
                res.status(200).json({
                    message: "There are no games to highlight.",
                    err
                });
            }

            ///fetch all userAchievements
            let userAchievementHighlights;
            try {
                userAchievementHighlights = await userAchievementController.findAchievementHighlights(userID);
            } catch(err){
                console.error(err);
                res.status(500).json({
                    message: "There was an error when fetching userAchievements for the userHighlights.",
                    err
                });
            }

            if(userAchievementHighlights.length == 0){
                res.status(500).json({
                    message: "There was an issue fetching achievements for the userHighlights.",
                    err
                });
            }

            let highlights = [];

            for(let userGameHighlight of userGameHighlights){

                let totalAchievements = userAchievementHighlights.filter(achievement => {
                    return achievement.gameID == userGameHighlight.gameID;
                }).length;
                let achievementProgress = 0;
                let completedAchievements = 0;
                if(totalAchievements > 0){
                    completedAchievements = userAchievementHighlights.filter(achievement => {
                        return achievement.achievementStatus === 'completed';
                    }).length;
                    achievementProgress = completedAchievements / totalAchievements;
                }
                
                let game = {
                    gameID: userGameHighlight['game.gameID'],
                    gameName: userGameHighlight['game.gameName'],
                    developers: userGameHighlight['game.developers'],
                    publishers: userGameHighlight['game.publishers'], 
                    genre: userGameHighlight['game.genre'],
                    releaseDate: userGameHighlight['game.releaseDate'],
                    gameCover: userGameHighlight['game.gameCover'],
                    platform: userGameHighlight['game.platform'],
                }
                let highlight = {
                    userGameID: userGameHighlight.userGameID,
                    userID: userGameHighlight.userID,
                    gameEnjoymentRating: userGameHighlight.gameEnjoymentRating,
                    achievementProgress: achievementProgress,
                    completedAchievements: completedAchievements,
                    totalAchievements: totalAchievements,
                    createdAt: userGameHighlight.createdAt,
                    updatedAt: userGameHighlight.updatedAt
                }
                highlight.game = game;
                highlights.push(highlight);
                
            }

            highlights.sort((a, b) => b.achievementProgress - a.achievementProgress);
            highlights = highlights.slice(0, 5);
            res.status(200).send(highlights);

        } else {
            res.status(400).send('UserID is required.');
        }
    } catch (err) {
        console.log(err);
    }
});


module.exports = router;