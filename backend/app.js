const express = require("express");
const cors = require("cors");
const app = express();
const multer = require('multer');
const bodyParser = require('body-parser');

const corsOptions ={
    origin:'http://localhost:4200', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));
app.use(express.json());
// database model
const db = require("./models");
db.sequelize.sync({alter: false, force: false}).then(() => {
    console.log("Synced db.");
}).catch((err) => {
    console.log("Failed to sync db: " + err.message);
});

// all routes
const home = require('./routes/home.route');
const role = require('./routes/role.route');
const user = require('./routes/user.route');
const token = require('./routes/token.route');
const game = require('./routes/game.route');
const achievement = require('./routes/achievement.route');
const userGame = require('./routes/userGame.route');
const userAchievement = require('./routes/userAchievement.route');
const board = require('./routes/board.route');
const userBoard = require('./routes/userBoard.route');
const thread = require('./routes/thread.route');
const threadItem = require('./routes/threadItem.route');
const userThread = require('./routes/userThread.route');
const userFriend = require('./routes/userFriend.route');
const userChat = require('./routes/userChat.route');
const userMessage = require('./routes/userMessage.route');
const userHighlight = require('./routes/userHighlight.route');

app.use("/home", home);
app.use("/user", user);
app.use("/role", role);
app.use("/token", token);
app.use("/game", game);
app.use("/achievement", achievement);
app.use("/userGame", userGame);
app.use("/userAchievement", userAchievement);
app.use("/userBoard", userBoard);
app.use("/userThread", userThread);
app.use("/board", board);
app.use("/thread", thread);
app.use("/threadItem", threadItem);
app.use("/userFriend", userFriend);
app.use("/userChat", userChat);
app.use("/userMessage", userMessage);
app.use("/userHighlight", userHighlight);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}.`)
});