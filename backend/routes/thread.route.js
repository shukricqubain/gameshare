const express = require("express");
const router = express.Router();
const threadController = require("../controllers/thread.controller");

// create a thread
router.post('/addThread', async function(req, res){
    try{
        ///create new thread
        let newThread = await threadController.create(req.body);
        if(typeof newThread === 'string'){
            res.status(403).send(newThread);
        } else {
            newThread = newThread['dataValues'];
            res.status(201).json({
                newThread: newThread
            });
        }
    } catch(err){
        res.status(500).json({
            message:"There was an error adding a thread to the database.",
            err
        });
    }
});

// get all threads
router.post('/allThreads', async function(req, res) {
    try{
        if(req.body !== null){
            let searchCriteria = req.body;
            let allThreads;
            let threadCount;
            if(searchCriteria.pagination){
                threadCount = await threadController.findCount(searchCriteria);
                if(boardCount > 0){
                    searchCriteria.threadCount = threadCount;
                    allThreads = await threadController.findAll(searchCriteria);
                    if(allThreads.message !== 'No data in thread table to fetch.'){
                        searchCriteria.data = allThreads;
                        return res.status(200).json(searchCriteria);
                    } else {
                        return res.status(204).send({message:'No data in thread table to fetch.'});
                    }
                } else {
                    return res.status(204).send({message:'No data in thread table to fetch.'});
                }
            } else {
                allThreads = await threadController.findAll(searchCriteria);
                threadCount = allThreads.length;
                if(allThreads.message !== 'No data in thread table to fetch.'){
                    searchCriteria.data = allThreads;
                    return res.status(200).json(searchCriteria);
                } else {
                    return res.status(204).send({message:'No data in thread table to fetch.'});
                }
            }
        } else {
            res.status(400).send('Search criteria is required.');
        }
    } catch(err){
        console.log(err)
    }
});

// get a single thread by their threadID
router.get('/singleThread/:threadID', async function(req, res){
    try{
        if(req.params.threadID !== undefined){
            let threadID = Number(req.params.threadID);
            let thread = await threadController.findOne(threadID);
            if(thread !== undefined && typeof thread !== 'string'){
                res.status(200).send(thread);
            } else {
                res.status(404).send(thread);
            }
        } else {
            res.status(400).send('threadID is required.');
        }
    } catch(err){
        console.log(err);
    }
});

// edit a thread by threadID
router.put('/editThread', async function(req, res){
    try{
        if(req.body.threadID !== undefined){
            const threadID = req.body.threadID;
            let thread = await threadController.findOne(threadID);
            if(thread == undefined || typeof thread === 'string'){
                return res.status(404).send(thread);
            }
            
            ///update thread
            let updatedThread = await threadController.update(threadID,req.body);
            if(typeof updatedThread === 'string'){
                return res.status(403).send(updatedThread);
            } else if(updatedThread[0] == 1){ 
                return res.status(200).json({
                    message: "The thread was updated successfully.",
                    threadID: updatedThread.threadID
                });
            } else {
                return res.status(503).send('Thread was not updated successfully.');
            }
        } else {
            return res.status(400).json({
                message:"The threadID is required to update a thread."
            });
        }
    } catch(err){
        return res.status(500).json({
            message:"There was an error when trying to edit a thread",
            err
        });
    }
});

// delete a thread by threadID
router.delete('/deleteThread/:threadID', async function(req, res){
    try{
        if(req.params.threadID !== undefined){
            let threadID = Number(req.params.threadID);
            let result = await threadController.delete(threadID);
            if(result == 1){
                res.status(200).json({
                    message:`Thread with ID: ${threadID} has been deleted successfully.`}
                );
            } else {
                res.status(503).send('Thread was not deleted successfully.');
            }
        } else {
            res.status(400).send('threadID is required.');
        }
    }catch(err){
        res.status(500).json({
            message:"There was an error when trying to delete a thread.",
            err
        });
    }
});

module.exports = router;