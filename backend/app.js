const express = require("express");
const cors = require("cors");
const app = express();

const corsOptions ={
    origin:'http://localhost:4200', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// database model
const db = require("./models");
db.sequelize.sync({alter: true, force: false}).then(() => {
    console.log("Synced db.");
}).catch((err) => {
    console.log("Failed to sync db: " + err.message);
});

// all routes
const home = require('./routes/home.route');
const role = require('./routes/role.route');
const user = require('./routes/user.route');
const token = require('./routes/token.route');

app.use("/home", home);
app.use("/user", user);
app.use("/role", role);
app.use("/token", token);


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}.`)
});