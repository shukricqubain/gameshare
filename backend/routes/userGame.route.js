const express = require("express");
const router = express.Router();
const userGameController = require("../controllers/userGame.controller");

// create a userGame
router.post('/addUserGame', async function(req, res){
    try{
        ///create new userGame
        let newUserGame = await userGameController.create(req.body);
        if(typeof newUserGame === 'string'){
            res.status(403).send(newUserGame);
        } else {
            newUserGame = newUserGame['dataValues'];
            res.status(201).json({
                newGame: newUserGame
            });
        }
    } catch(err){
        res.status(500).json({
            message:"There was an error adding a userGame to the database.",
            err
        });
    }
});

// get all userGames
router.post('/allUserGames', async function(req, res) {
    try{
        if(req.body !== null){
            let searchCriteria = req.body;
            let allUserGames;
            let userGameCount;
            if(searchCriteria.pagination){
                userGameCount = await userGameController.findCount(searchCriteria);
                if(userGameCount > 0){
                    searchCriteria.gameCount = userGameCount;
                    allUserGames = await userGameController.findAll(searchCriteria);
                    if(allUserGames.message !== 'No data in userGame table to fetch.'){
                        searchCriteria.data = allUserGames;
                        return res.status(200).json(searchCriteria);
                    } else {
                        return res.status(204).send({message:'No data in userGame table to fetch.'});
                    }
                } else {
                    return res.status(204).send({message:'No data in userGame table to fetch.'});
                }
            } else {
                allUserGames = await userGameController.findAll(searchCriteria);
                userGameCount = allUserGames.length;
                if(allUserGames.message !== 'No data in userGame table to fetch.'){
                    searchCriteria.data = allUserGames;
                    return res.status(200).json(searchCriteria);
                } else {
                    return res.status(204).send({message:'No data in userGame table to fetch.'});
                }
            }
        } else {
            res.status(400).send('Search criteria is required.');
        }
    } catch(err){
        console.log(err)
    }
});

// get all userGames by IDs
router.post('/allUserGamesByIDs', async function(req, res) {
    try{
        if(req.body !== null){
            let searchCriteria = req.body;
            let allUserGames;
            let userGameCount;
            if(searchCriteria.pagination){
                userGameCount = await userGameController.findCountByIDs(searchCriteria);
                if(userGameCount > 0){
                    searchCriteria.gameCount = userGameCount;
                    allUserGames = await userGameController.findAllByIDs(searchCriteria);
                    if(allUserGames.message !== 'No data in userGame table to fetch.'){
                        searchCriteria.data = allUserGames;
                        return res.status(200).json(searchCriteria);
                    } else {
                        return res.status(204).send({message:'No data in userGame table to fetch.'});
                    }
                } else {
                    return res.status(204).send({message:'No data in userGame table to fetch.'});
                }
            } else {
                allUserGames = await userGameController.findAllByIDs(searchCriteria);
                userGameCount = allUserGames.length;
                if(allUserGames.message !== 'No data in userGame table to fetch.'){
                    searchCriteria.data = allUserGames;
                    return res.status(200).json(searchCriteria);
                } else {
                    return res.status(204).send({message:'No data in userGame table to fetch.'});
                }
            }
        } else {
            res.status(400).send('Search criteria is required.');
        }
    } catch(err){
        console.log(err)
    }
});


// get a single userGame by their userGameID
router.get('/singleUserGame/:userGameID', async function(req, res){
    try{
        if(req.params.userGameID !== undefined){
            let userGameID = Number(req.params.userGameID);
            let userGame = await userGameController.findOne(userGameID);
            if(userGame !== undefined && typeof userGame !== 'string'){
                res.status(200).send(userGame);
            } else {
                res.status(404).send(userGame);
            }
        } else {
            res.status(400).send('UserGameID is required.');
        }
    } catch(err){
        console.log(err);
    }
});

// edit a userGame by userGameID
router.put('/editUserGame', async function(req, res){
    try{
        if(req.body.userGameID !== undefined){
            const userGameID = req.body.userGameID;
            let userGame = await userGameController.findOne(userGameID);
            if(userGame == undefined || typeof userGame === 'string'){
                return res.status(404).send(userGame);
            }
            
            ///update userGame
            let updatedUserGame = await userGameController.update(userGameID,req.body);
            if(typeof updatedUserGame === 'string'){
                return res.status(403).send(updatedUserGame);
            } else if(updatedUserGame[0] == 1){ 
                return res.status(200).json({
                    message: "The userGame was updated successfully.",
                    userGameID: updatedUserGame.userGameID
                });
            } else {
                return res.status(503).send('UserGame was not updated successfully.');
            }
        } else {
            return res.status(400).json({
                message:"The userGameID is required to update a userGame."
            });
        }
    } catch(err){
        return res.status(500).json({
            message:"There was an error when trying to edit a userGame.",
            err
        });
    }
});

// delete a userGame by userGameID
router.delete('/deleteUserGame/:userGameID', async function(req, res){
    try{
        if(req.params.userGameID !== undefined){
            let userGameID = Number(req.params.userGameID);
            let result = await userGameController.delete(userGameID);
            if(result == 1){
                res.status(200).json({
                    message:`UserGame with ID: ${userGameID} has been deleted successfully.`}
                );
            } else {
                res.status(503).send('UserGame was not deleted successfully.');
            }
        } else {
            res.status(400).send('UserGameID is required.');
        }
    }catch(err){
        res.status(500).json({
            message:"There was an error when trying to delete a userGame.",
            err
        });
    }
});

module.exports = router;