// user.js - User route module.
const express = require("express");
const router = express.Router();
const tokenController = require("../controllers/token.controller");

// create token
router.post('/addToken', async function(req, res){
    try{
        
        ///create new token
        let newToken = await tokenController.create(token);
        if(typeof newToken === 'string'){
            res.status(403).send(newToken);
        } else {
            newToken = newToken['dataValues'];
            console.log(newToken)
            res.status(201).json({
                newToken: newToken
            });
        }
    } catch(err){
        res.status(500).json({
            message:"There was an error adding a token to the database.",
            err
        });
    }
});

// get all tokens
router.get('/allTokens', async function(req, res) {
    try{
        let all_tokens = await tokenController.findAll();
        if(all_tokens.message !== 'No data in token table to fetch.'){
            res.status(200).send(all_tokens);
        } else {
            res.status(204).send(all_tokens);
        }
    } catch(err){
        console.log(err)
    }
});

// get a single token by their tokenID
router.get('/singleToken/:tokenID', async function(req, res){
    try{
        if(req.params.tokenID !== undefined){
            let tokenID = Number(req.params.tokenID);
            let token = await tokenController.findOne(tokenID);
            if(token !== undefined && typeof token !== 'string'){
                res.status(200).send(token);
            } else {
                res.status(404).send(token);
            }
        } else {
            res.status(400).send('Token ID is required.');
        }
    } catch(err){
        console.log(err);
    }
});

// get a single token by their username
router.get('/singleTokenByName/:userName', async function(req, res){
    try{
        if(req.params.userName !== undefined){
            let userName = req.params.userName;
            let token = await tokenController.findUsername(userName);
            if(token !== undefined && typeof token !== 'string'){
                res.status(200).send(token);
            } else {
                res.status(404).send(token);
            }
        } else {
            res.status(400).send('Username is required.');
        }
    } catch(err){
        console.log(err);
    }
});

// edit a token by tokenID
router.put('/editToken', async function(req, res){
    try{
        if(req.body.tokenID !== undefined){
            const tokenID = req.body.tokenID;
            let token = await tokenController.findOne(tokenID);
            if(token == undefined || typeof token === 'string'){
                res.status(404).send(token);
            }
            
            ///update token
            let updatedToken = await tokenController.update(tokenID,req.body);
            
            if(typeof updatedToken === 'string'){
                res.status(403).send(updatedToken);
            } else if(updatedToken[0] == 1){ 
                res.status(200).json({
                    message: "The token was updated successfully.",
                    token_id: updatedToken.tokenID
                });
            } else {
                res.status(503).send('Token was not updated successfully.');
            }
        } else {
            res.status(400).json({
                message:"The userID is required to update a token."
            });
        }
    } catch(err){
        res.status(500).json({
            message:"There was an error when trying to edit a token.",
            err
        });
    }
});

// delete a token by tokenID
router.delete('/deleteToken/:tokenID', async function(req, res){
    try{
        if(req.params.tokenID !== undefined){
            let tokenID = Number(req.params.tokenID);
            let result = await tokenController.delete(tokenID);
            if(result == 1){
                res.status(200).json({
                    message:`Token with ID: ${tokenID} has been deleted successfully.`}
                );
            } else {
                res.status(503).send('Token was not deleted successfully.');
            }
        } else {
            res.status(400).send('Token ID is required.');
        }
    }catch(err){
        res.status(500).json({
            message:"There was an error when trying to delete a token.",
            err
        });
    }
});

module.exports = router;