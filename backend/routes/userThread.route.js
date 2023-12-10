const express = require("express");
const router = express.Router();
const userThreadController = require("../controllers/userThread.controller");

// create a userThread
router.post('/addUserThread', async function(req, res){
    try{
        ///create new userThread
        let newUserThread = await userThreadController.create(req.body);
        if(typeof newUserThread === 'string'){
            res.status(403).send(newThread);
        } else {
            newUserThread = newUserThread['dataValues'];
            res.status(201).json({
                newUserThread: newUserThread
            });
        }
    } catch(err){
        res.status(500).json({
            message:"There was an error adding a userThread to the database.",
            err
        });
    }
});

// get all userThreads
router.post('/allUserThreads', async function(req, res) {
    try{
        if(req.body !== null){
            let searchCriteria = req.body;
            let allUserThreads;
            let userThreadCount;
            if(searchCriteria.pagination === 'true'){
                userThreadCount = await userThreadController.findCount(searchCriteria);
                if(userThreadCount > 0){
                    searchCriteria.userThreadCount = userThreadCount;
                    allUserThreads = await userThreadController.findAll(searchCriteria);
                    if(allUserThreads.message !== 'No data in userThread table to fetch.'){
                        searchCriteria.data = allUserThreads;
                        return res.status(200).json(searchCriteria);
                    } else {
                        return res.status(204).send({message:'No data in userThread table to fetch.'});
                    }
                } else {
                    return res.status(204).send({message:'No data in userThread table to fetch.'});
                }
            } else {
                allUserThreads = await userThreadController.findAll(searchCriteria);
                userThreadCount = allUserThreads.length;
                if(allUserThreads.message !== 'No data in userThread table to fetch.'){
                    searchCriteria.data = allUserThreads;
                    return res.status(200).json(searchCriteria);
                } else {
                    return res.status(204).send({message:'No data in userThread table to fetch.'});
                }
            }
        } else {
            res.status(400).send('Search criteria is required.');
        }
    } catch(err){
        console.log(err)
    }
});

// get a single userThread by their userThreadID
router.get('/singleThread/:userThreadID', async function(req, res){
    try{
        if(req.params.userThreadID !== undefined){
            let userThreadID = Number(req.params.userThreadID);
            let userThread = await userThreadController.findOne(userThreadID);
            if(userThread !== undefined && typeof userThread !== 'string'){
                res.status(200).send(userThread);
            } else {
                res.status(404).send(userThread);
            }
        } else {
            res.status(400).send('userThreadID is required.');
        }
    } catch(err){
        console.log(err);
    }
});

// edit a userThread by userThreadID
router.put('/editUserThread', async function(req, res){
    try{
        if(req.body.userThreadID !== undefined){
            const userThreadID = req.body.userThreadID;
            let userThread = await userThreadController.findOne(userThreadID);
            if(userThread == undefined || typeof userThread === 'string'){
                return res.status(404).send(userThread);
            }
            
            ///update userThread
            let updatedUserThread = await userThreadController.update(userThreadID,req.body);
            if(typeof updatedUserThread === 'string'){
                return res.status(403).send(updatedUserThread);
            } else if(updatedUserThread[0] == 1){ 
                return res.status(200).json({
                    message: "The userThread was updated successfully.",
                    userThreadID: updatedUserThread.userThreadID
                });
            } else {
                return res.status(503).send('UserThread was not updated successfully.');
            }
        } else {
            return res.status(400).json({
                message:"The userThreadID is required to update a userThread."
            });
        }
    } catch(err){
        return res.status(500).json({
            message:"There was an error when trying to edit a userThread",
            err
        });
    }
});

// delete a userThread by userThreadID
router.delete('/deleteUserThread/:userThreadID', async function(req, res){
    try{
        if(req.params.userThreadID !== undefined){
            let userThreadID = Number(req.params.userThreadID);
            let result = await userThreadController.delete(userThreadID);
            if(result == 1){
                res.status(200).json({
                    message:`UserThread with ID: ${userThreadID} has been deleted successfully.`}
                );
            } else {
                res.status(503).send('UserThread was not deleted successfully.');
            }
        } else {
            res.status(400).send('userThreadID is required.');
        }
    }catch(err){
        res.status(500).json({
            message:"There was an error when trying to delete a userThread.",
            err
        });
    }
});

module.exports = router;