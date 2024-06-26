const express = require("express");
const router = express.Router();
const gameController = require("../controllers/game.controller");
const upload = require("../middleware/upload");

// upload gameCover
router.post('/uploadGameCover/:assetLocation', async function (req, res) {
    try {
        upload(req, res, (err) => {
            if (err) {
                console.error(err);
                res.status(400).send(err)
            } else {
                res.status(200).json({
                    message: "File Uploaded Successfully"
                });
            }
        })
    } catch (err) {
        console.error(err);
        if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(500).send({
                message: "File size cannot be larger than 2MB!",
            });
        }
        res.status(500).send({
            message: `Could not upload the file: ${req.body.fileName}. ${err}`,
        });
    }
});

// create game
router.post('/addGame', async function (req, res) {
    try {
        ///create new game
        let newGame = await gameController.create(req.body);
        if (typeof newGame === 'string') {
            res.status(403).send(newGame);
        } else {
            newGame = newGame['dataValues'];
            res.status(201).json({
                newGame: newGame
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "There was an error adding a game to the database.",
            err
        });
    }
});

// get all games
router.post('/allGames', async function (req, res) {
    try {
        if (req.body !== null) {
            let searchCriteria = req.body;
            let allGames;
            let gameCount;
            if (searchCriteria.pagination === 'true') {
                gameCount = await gameController.findCount(searchCriteria);
                searchCriteria.gameCount = gameCount;
                allGames = await gameController.findAll(searchCriteria);
                if (allGames.message !== 'No data in game table to fetch.') {
                    searchCriteria.data = allGames;
                    return res.status(200).json(searchCriteria);
                } else {
                    return res.status(200).send({ message: 'No data in game table to fetch.' });
                }
            } else {
                allGames = await gameController.findAll(searchCriteria);
                gameCount = allGames.length;
                searchCriteria.gameCount = gameCount;
                if (allGames.message !== 'No data in game table to fetch.') {
                    searchCriteria.data = allGames;
                    return res.status(200).json(searchCriteria);
                } else {
                    return res.status(200).send({ message: 'No data in game table to fetch.' });
                }
            }
        } else {
            res.status(400).send('Search criteria is required.');
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "There was an error getting all games.",
            err
        });
    }
});

// get a single game by their gameID
router.get('/singleGame/:gameID', async function (req, res) {
    try {
        if (req.params.gameID !== undefined) {
            let gameID = Number(req.params.gameID);
            let game = await gameController.findOne(gameID);
            if (game !== undefined && typeof game !== 'string') {
                res.status(200).send(game);
            } else {
                res.status(404).send(game);
            }
        } else {
            res.status(400).send('Game ID is required.');
        }
    } catch (err) {
        console.log(err);
    }
});

// get a single game by their gameName
router.get('/singleGameByName/:gameName', async function (req, res) {
    try {
        if (req.params.gameName !== undefined) {
            let gameName = req.params.gameName;
            let game = await gameController.findOneByName(gameName);
            if (game !== undefined && typeof game !== 'string') {
                res.status(200).send(game);
            } else {
                res.status(200).send(game);
            }
        } else {
            res.status(400).send('Game Name is required.');
        }
    } catch (err) {
        console.log(err);
    }
});

// get all gameNames in the database
router.get('/allGameNames', async function (req, res) {
    try {
        let allGameNames = await gameController.findAllGameNames();
        if (allGameNames !== undefined && allGameNames !== null) {
            res.status(200).send(allGameNames);
        } else {
            res.status(200).send(`No game names found in the database.`);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "There was an error getting all game names from the database.",
            err
        });
    }
});

// edit a game by gameID
router.put('/editGame', async function (req, res) {
    try {
        if (req.body.gameID !== undefined) {
            const gameID = req.body.gameID;
            let game = await gameController.findOne(gameID);
            if (game == undefined || typeof game === 'string') {
                res.status(404).send(game);
            }

            ///update game
            let updatedGame = await gameController.update(gameID, req.body);

            if (typeof updatedGame === 'string') {
                res.status(403).send(updatedGame);
            } else if (updatedGame[0] == 1) {
                res.status(200).json({
                    message: "The game was updated successfully.",
                    gameID: updatedGame.gameID
                });
            } else {
                res.status(503).send('Game was not updated successfully.');
            }
        } else {
            res.status(400).json({
                message: "The gameID is required to update a game."
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "There was an error when trying to edit a game.",
            err
        });
    }
});

// delete a game by gameID
router.delete('/deleteGame/:gameID', async function (req, res) {
    try {
        if (req.params.gameID !== undefined) {
            let gameID = Number(req.params.gameID);
            let result = await gameController.delete(gameID);
            if (result == 1) {
                res.status(200).json({
                    message: `Game with ID: ${gameID} has been deleted successfully.`
                }
                );
            } else {
                res.status(503).send('Game was not deleted successfully.');
            }
        } else {
            res.status(400).send('Game ID is required.');
        }
    } catch (err) {
        res.status(500).json({
            message: "There was an error when trying to delete a game.",
            err
        });
    }
});

module.exports = router;