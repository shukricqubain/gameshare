const express = require("express");
const router = express.Router();
const threadItemController = require("../controllers/threadItem.controller");

// create a threadItem
router.post('/addThreadItem', async function(req, res){
    try{
        ///create new threadItem
        let newThreadItem = await threadItemController.create(req.body);
        if(typeof newThreadItem === 'string'){
            res.status(403).send(newThreadItem);
        } else {
            newThreadItem = newThreadItem['dataValues'];
            res.status(201).json({
                newThreadItem: newThreadItem
            });
        }
    } catch(err){
        res.status(500).json({
            message:"There was an error adding a threadItem to the database.",
            err
        });
    }
});

// get all threadItems
router.post('/allThreadItems', async function(req, res) {
    try{
        if(req.body !== null){
            let searchCriteria = req.body;
            let allThreadItems;
            let threadItemCount;
            if(searchCriteria.pagination === 'true'){
                threadItemCount = await threadItemController.findCount(searchCriteria);
                if(threadItemCount > 0){
                    searchCriteria.threadItemCount = threadItemCount;
                    allThreadItems = await threadItemController.findAll(searchCriteria);
                    if(allThreadItems.message !== 'No data in threadItem table to fetch.'){
                        searchCriteria.data = allThreadItems;
                        return res.status(200).json(searchCriteria);
                    } else {
                        return res.status(204).send({message:'No data in threadItem table to fetch.'});
                    }
                } else {
                    return res.status(204).send({message:'No data in threadItem table to fetch.'});
                }
            } else {
                allThreadItems = await threadItemController.findAll(searchCriteria);
                threadItemCount = allThreadItems.length;
                if(allThreadItems.message !== 'No data in threadItem table to fetch.'){
                    searchCriteria.data = allThreadItems;
                    return res.status(200).json(searchCriteria);
                } else {
                    return res.status(204).send({message:'No data in threadItem table to fetch.'});
                }
            }
        } else {
            res.status(400).send('Search criteria is required.');
        }
    } catch(err){
        console.log(err)
    }
});

// get a single threadItem by their threadItemID
router.get('/singleThreadItem/:threadItemID', async function(req, res){
    try{
        if(req.params.threadItemID !== undefined){
            let threadItemID = Number(req.params.threadItemID);
            let threadItem = await threadItemController.findOne(threadItemID);
            if(threadItem !== undefined && typeof threadItem !== 'string'){
                res.status(200).send(threadItem);
            } else {
                res.status(404).send(threadItem);
            }
        } else {
            res.status(400).send('threadItemID is required.');
        }
    } catch(err){
        console.log(err);
    }
});

// edit a threadItem by threadItemID
router.put('/editThreadItem', async function(req, res){
    try{
        if(req.body.threadItemID !== undefined){
            const threadItemID = req.body.threadItemID;
            let threadItem = await threadItemController.findOne(threadItemID);
            if(threadItem == undefined || typeof threadItem === 'string'){
                return res.status(404).send(threadItem);
            }
            
            ///update thread
            let updatedThreadItem = await threadItemController.update(threadItemID,req.body);
            if(typeof updatedThreadItem === 'string'){
                return res.status(403).send(updatedThreadItem);
            } else if(updatedThreadItem[0] == 1){ 
                return res.status(200).json({
                    message: "The threadItem was updated successfully.",
                    threadItemID: updatedThreadItem.threadItemID
                });
            } else {
                return res.status(503).send('ThreadItem was not updated successfully.');
            }
        } else {
            return res.status(400).json({
                message:"The threadItemID is required to update a threadItem."
            });
        }
    } catch(err){
        return res.status(500).json({
            message:"There was an error when trying to edit a threadItem",
            err
        });
    }
});

// delete a threadItem by threadItemID
router.delete('/deleteThreadItem/:threadItemID', async function(req, res){
    try{
        if(req.params.threadItemID !== undefined){
            let threadItemID = Number(req.params.threadItemID);
            let result = await threadItemController.delete(threadItemID);
            if(result == 1){
                res.status(200).json({
                    message:`ThreadItem with ID: ${threadItemID} has been deleted successfully.`}
                );
            } else {
                res.status(503).send('ThreadItem was not deleted successfully.');
            }
        } else {
            res.status(400).send('threadItemID is required.');
        }
    }catch(err){
        res.status(500).json({
            message:"There was an error when trying to delete a threadItem.",
            err
        });
    }
});

module.exports = router;