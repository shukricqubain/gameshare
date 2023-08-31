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
router.get('/allAchievements', async function(req, res) {
    try{
        let allAchievements = await achievementController.findAll();
        if(allAchievements.message !== 'No data in achievement table to fetch.'){
            res.status(200).send(allAchievements);
        } else {
            res.status(204).send(allAchievements);
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