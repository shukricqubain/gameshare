const express = require("express");
const router = express.Router();
const achievementController = require("../controllers/achievement.controller");

// create achievement
router.post('/addAchievement', async function(req, res){
    try{
        
        ///create new achievement
        let newAchievement = await achievementController.create(req.body);
        if(typeof newAchievement === 'string'){
            res.status(403).send(newAchievement);
        } else {
            newAchievement = newAchievement['dataValues'];
            res.status(201).json({
                newGame: newAchievement
            });
        }
    } catch(err){
        res.status(500).json({
            message:"There was an error adding a achievement to the database.",
            err
        });
    }
});

// get all achievement
router.post('/allAchievements', async function(req, res) {
    try{
        if(req.body !== null){
            let searchCriteria = req.body;
            let allAchievements;
            let achievementCount;
            console.log(searchCriteria)
            if(searchCriteria.pagination === 'true'){
                achievementCount = await achievementController.findCount(searchCriteria);
                searchCriteria.achievementCount = achievementCount;
                allAchievements = await achievementController.findAll(searchCriteria);
                if(allAchievements.message !== 'No data in achievement table to fetch.'){
                    searchCriteria.data = allAchievements;
                    return res.status(200).json(searchCriteria);
                } else {
                    return res.status(200).json({message:'No data in achievement table to fetch.'});
                }
            } else {
                allAchievements = await achievementController.findAll(searchCriteria);
                achievementCount = allAchievements.length;
                if(allAchievements.message !== 'No data in achievement table to fetch.'){
                    searchCriteria.data = allAchievements;
                    return res.status(200).json(searchCriteria);
                } else {
                    return res.status(200).json({message:'No data in achievement table to fetch.'});
                }
            }
        } else {
            res.status(400).send('Search criteria is required.');
        }
    } catch(err){
        console.log(err)
    }
});

// get a single achievement by their achievementID
router.get('/singleAchievement/:achievementID', async function(req, res){
    try{
        if(req.params.achievementID !== undefined){
            let achievementID = Number(req.params.achievementID);
            let achievement = await achievementController.findOne(achievementID);
            if(achievement !== undefined && typeof achievement !== 'string'){
                res.status(200).send(achievement);
            } else {
                res.status(404).send(achievement);
            }
        } else {
            res.status(400).send('Achievement ID is required.');
        }
    } catch(err){
        console.log(err);
    }
});

// get all achievements by their gameID
router.get('/achievementsByGameID/:gameID', async function(req, res){
    try{
        if(req.params.gameID !== undefined){
            let gameID = Number(req.params.gameID);
            let achievements = await achievementController.findByGameID(gameID);
            if(achievements !== undefined && typeof achievements !== 'string'){
                res.status(200).send(achievements);
            } else {
                res.status(404).send(achievements);
            }
        } else {
            res.status(400).send('Game ID is required.');
        }
    } catch(err){
        console.log(err);
    }
});

// get all achievementNames in the database
router.get('/allAchievementNames', async function(req, res){
    try{
        let allAchievementNames = await achievementController.findAllAchievementNames();
        if(allAchievementNames !== undefined && allAchievementNames !== null){
            res.status(200).send(allAchievementNames);
        } else {
            res.status(200).send(`No achievement names found in the database.`);
        }
    } catch(err){
        console.log(err);
        res.status(500).json({
            message:"There was an error getting all achievement names from the database.",
            err
        });
    }
});

// edit a achievement by achievementID
router.put('/editAchievement', async function(req, res){
    try{
        if(req.body.achievementID !== undefined){
            const achievementID = req.body.achievementID;
            let achievement = await achievementController.findOne(achievementID);
            if(achievement == undefined || typeof achievement === 'string'){
                res.status(404).send(achievement);
            }
            
            ///update game
            let updatedAchievement = await achievementController.update(achievementID,req.body);
            
            if(typeof updatedAchievement === 'string'){
                res.status(403).send(updatedAchievement);
            } else if(updatedAchievement[0] == 1){ 
                res.status(200).json({
                    message: "The achievement was updated successfully.",
                    achievementID: updatedAchievement.achievementID
                });
            } else {
                res.status(503).send('Achievement was not updated successfully.');
            }
        } else {
            res.status(400).json({
                message:"The achievementID is required to update a achievement."
            });
        }
    } catch(err){
        res.status(500).json({
            message:"There was an error when trying to edit a achievement.",
            err
        });
    }
});

// delete a achievement by achievementID
router.delete('/deleteAchievement/:achievementID', async function(req, res){
    try{
        if(req.params.achievementID !== undefined){
            let achievementID = Number(req.params.achievementID);
            let result = await achievementController.delete(achievementID);
            if(result == 1){
                res.status(200).json({
                    message:`Achievement with ID: ${achievementID} has been deleted successfully.`}
                );
            } else {
                res.status(503).send('Achievement was not deleted successfully.');
            }
        } else {
            res.status(400).send('Achievement ID is required.');
        }
    }catch(err){
        res.status(500).json({
            message:"There was an error when trying to delete an achievement.",
            err
        });
    }
});

module.exports = router;