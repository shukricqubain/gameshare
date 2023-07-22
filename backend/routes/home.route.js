// home.route.js - Index Home route module.

const express = require("express");
const router = express.Router();

// Home page route.
router.get('/', function(req,res){
    res.send('Welcome to Demo Home page.');
});

module.exports = router;