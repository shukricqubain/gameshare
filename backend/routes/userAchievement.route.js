const express = require("express");
const router = express.Router();
const userAchievementController = require("../controllers/userAchievement.controller");

// create userAchievement
router.post('/addUserAchievement', async function(req, res){
    try{
        
        ///create new achievement
        let newUserAchievement = await userAchievementController.create(req.body);
        if(typeof newUserAchievement === 'string'){
            res.status(403).send(newUserAchievement);
        } else {
            newUserAchievement = newUserAchievement['dataValues'];
            res.status(201).json({
                newGame: newUserAchievement
            });
        }
    } catch(err){
        res.status(500).json({
            message:"There was an error adding a new user achievement to the database.",
            err
        });
    }
});

// get all user Achievements
router.post('/allUserAchievements', async function(req, res) {
    try{
        if(req.body !== null){
            let searchCriteria = req.body;
            let allUserAchievements;
            let userAchievementCount;
            if(searchCriteria.pagination === 'true'){
                userAchievementCount = await userAchievementController.findCount(searchCriteria);
                searchCriteria.achievementCount = userAchievementCount;
                allUserAchievements = await userAchievementController.findAll(searchCriteria);
                if(allUserAchievements.message !== 'No data in user achievement table to fetch.'){
                    searchCriteria.data = allUserAchievements;
                    return res.status(200).json(searchCriteria);
                } else {
                    return res.status(200).send({message:'No data in user achievement table to fetch.'});
                }
            } else {
                allUserAchievements = await userAchievementController.findAll(searchCriteria);
                userAchievementCount = allUserAchievements.length;
                if(allUserAchievements.message !== 'No data in user achievement table to fetch.'){
                    searchCriteria.data = allUserAchievements;
                    return res.status(200).json(searchCriteria);
                } else {
                    return res.status(200).send({message:'No data in user achievement table to fetch.'});
                }
            }
        } else {
            res.status(400).send('Search criteria is required.');
        }
    } catch(err){
        console.log(err)
    }
});

// get a single userAchievement by their userAchievementID
router.get('/singleUserAchievement/:userAchievementID', async function(req, res){
    try{
        if(req.params.userAchievementID !== undefined){
            let userAchievementID = Number(req.params.userAchievementID);
            let userAchievement = await userAchievementController.findOne(userAchievementID);
            if(userAchievement !== undefined && typeof userAchievement !== 'string'){
                res.status(200).send(userAchievement);
            } else {
                res.status(404).send(userAchievement);
            }
        } else {
            res.status(400).send('UserAchievement ID is required.');
        }
    } catch(err){
        console.log(err);
    }
});

// get all userAchievements by userID
router.get('/userAchievementsByUserID/:userID', async function(req, res){
    try{
        if(req.params.userID !== undefined){
            let userID = Number(req.params.userID);
            let userAchievements = await userAchievementController.findAllByUserID(userID);
            if(userAchievements !== undefined && typeof userAchievements !== 'string'){
                res.status(200).send(userAchievements);
            } else {
                res.status(404).send(userAchievements);
            }
        } else {
            res.status(400).send('UserAchievement ID is required.');
        }
    } catch(err){
        console.log(err);
    }
});

// edit a userAchievement by userAchievementID
router.put('/editUserAchievement', async function(req, res){
    try{
        if(req.body.userAchievementID !== undefined){
            const userAchievementID = req.body.userAchievementID;
            let userAchievement = await userAchievementController.findOne(userAchievementID);
            if(userAchievement == undefined || typeof userAchievement === 'string'){
                res.status(404).send(achievement);
            }
            
            ///update userAchievement
            let updatedUserAchievement = await userAchievementController.update(userAchievementID, req.body);
            
            if(typeof updatedUserAchievement === 'string'){
                res.status(403).send(updatedUserAchievement);
            } else if(updatedUserAchievement[0] == 1){ 
                res.status(200).json({
                    message: "The user achievement was updated successfully.",
                    achievementID: updatedUserAchievement.userAchievementID
                });
            } else {
                res.status(503).send('User achievement was not updated successfully.');
            }
        } else {
            res.status(400).json({
                message:"The userAchievementID is required to update a user achievement."
            });
        }
    } catch(err){
        res.status(500).json({
            message:"There was an error when trying to edit a user achievement.",
            err
        });
    }
});

// delete a userAchievement by userAchievementID
router.delete('/deleteUserAchievement/:userAchievementID', async function(req, res){
    try{
        if(req.params.userAchievementID !== undefined){
            let userAchievementID = Number(req.params.userAchievementID);
            let result = await userAchievementController.delete(userAchievementID);
            if(result == 1){
                res.status(200).json({
                    message:`User achievement with ID: ${userAchievementID} has been deleted successfully.`}
                );
            } else {
                res.status(503).send('User achievement was not deleted successfully.');
            }
        } else {
            res.status(400).send('User achievement ID is required.');
        }
    }catch(err){
        res.status(500).json({
            message:"There was an error when trying to delete an user achievement.",
            err
        });
    }
});

module.exports = router;