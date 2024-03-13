const express = require("express");
const router = express.Router();
const userGameController = require("../controllers/userGame.controller");
const userThreadController = require("../controllers/userThread.controller");
const threadItemController = require("../controllers/threadItem.controller");
const userAchievementController = require("../controllers/userAchievement.controller");
const { threadItem } = require("../models");

router.get('/getUserGameHighlights/:userID', async function (req, res) {
    try {
        if (req.params.userID != undefined) {
            let userID = Number(req.params.userID);

            ///fetch userGames
            let userGameHighlights;
            try {
                userGameHighlights = await userGameController.findGameHighlights(userID);
            } catch (err) {
                console.error(err);
                return res.status(500).json({
                    message: "There was an error when fetching userGames for the userHighlights.",
                    err
                });
            }

            if (userGameHighlights.length == 0) {
                return res.status(200).json({
                    message: "There are no games to highlight."
                });
            }

            ///fetch all userAchievements
            let userAchievementHighlights;
            try {
                userAchievementHighlights = await userAchievementController.findAchievementHighlights(userID);
            } catch (err) {
                console.error(err);
                return res.status(500).json({
                    message: "There was an error when fetching userAchievements for the userHighlights.",
                    err
                });
            }

            if (userAchievementHighlights.length == 0) {
                return res.status(500).json({
                    message: "There was an issue fetching achievements for the userHighlights.",
                    err
                });
            }

            let highlights = [];

            for (let userGameHighlight of userGameHighlights) {

                let totalAchievements = userAchievementHighlights.filter(achievement => {
                    return achievement.gameID == userGameHighlight.gameID;
                }).length;
                let achievementProgress = 0;
                let completedAchievements = 0;
                if (totalAchievements > 0) {
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
            return res.status(200).send(highlights);

        } else {
            return res.status(400).send('UserID is required.');
        }
    } catch (err) {
        console.error(err);
    }
});

router.get('/getUserThreadHighlights/:userID', async function (req, res) {
    try {
        if (req.params.userID != undefined) {
            let userID = Number(req.params.userID);

            ///fetch userThreadItems
            let userThreadItems;
            try {
                userThreadItems = await threadItemController.findThreadItemHighlights(userID);
            } catch (err) {
                console.error(err);
                return res.status(500).json({
                    message: "There was an error when fetching userGames for the userHighlights.",
                    err
                });
            }

            ///check there are userThreadItems
            if (typeof userThreadItems === 'string' && userThreadItems === 'Cannot find userThreadItemHighlights with specified userID') {
                return res.status(200).json({
                    message: "There are no threads to highlight."
                });
            }

            ///fetch userThreadHighlights based on usrID and threadIDs
            let userThreadHighlights;
            try {
                userThreadHighlights = await userThreadController.findThreadHighlights(userID);
            } catch (err) {
                console.error(err);
                return res.status(500).json({
                    message: "There was an error when fetching userGames for the userHighlights.",
                    err
                });
            }

            ///check there are userThreadHighlights
            if (typeof userThreadHighlights === 'string' && userThreadHighlights === 'Cannot find userThreadHighlights with specified userID') {
                return res.status(200).json({
                    message: "There are no threads to highlight."
                });
            }

            let highlights = [];
            //check each post to see if user follows the thread they posted on
            for (let userThreadItem of userThreadItems) {

                let findThread = userThreadHighlights.find(obj => obj.threadID == userThreadItem.threadID);
                if (findThread) {
                    userThreadItem.isFollowing = true;
                } else {
                    userThreadItem.isFollowing = false;
                }

                let threadItem = {
                    threadName: userThreadItem["thread.threadName"],
                    boardName: userThreadItem["thread.boardName"],
                    threadItemImage: userThreadItem["thread.threadItemImage"],
                    threadMessage: userThreadItem.threadMessage,
                    createdAt: userThreadItem.createdAt,
                    updateAt: userThreadItem.updatedAt
                }
                highlights.push(threadItem);
            }

            res.status(200).send(highlights);

        } else {
            return res.status(400).send('UserID is required.');
        }
    } catch (err) {
        console.error(err);
    }
});

module.exports = router;