const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
const session = require('express-session')

global.__basedir = __dirname;

const app = express();

app.use(
    session({
        resave: true,
        saveUninitialized: true,
        secret: "shamil",
    })
);


// Load environment variables from .env file
dotenv.config();

const corsOptions = {
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
    credentials: true,
}


app.use(cors(corsOptions));
app.use('/uploads', express.static('uploads'))
// Sequelize
const db = require("./models");
const sequelize = require("sequelize");
const {sendMail} = require("./controllers/verification.controller");
const {getCounts} = require("./controllers/main.controller");

db.sequelize.sync();

const Election = db.elections

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

// simple route
app.get("/", (req, res) => {
    res.json({message: "Welcome to E-VOTING application."});
});

app.get("/clear", async (req, res) => {
    let candidates = await db.sequelize.query(
        'DELETE FROM evotingdb.candidates;'
    )
    let elections = await db.sequelize.query(
        'DELETE FROM evotingdb.elections;'
    )
    let constituencies = await db.sequelize.query(
        'DELETE FROM evotingdb.constituencies;'
    )
    let users = await db.sequelize.query(
        'DELETE FROM evotingdb.users'
    )
    res.json({status: 'success'})
})

require('./routes/main.routes')(app)
require('./routes/election.routes')(app)
require('./routes/constituency.routes')(app)
require('./routes/candidate.routes')(app)
require('./routes/user.routes')(app)
require('./routes/verification.routes')(app)
/*
* election/
* election/id TODO
* getActiveElections/ TODO
* startElection/ TODO
* endElection/ TODO
* publishResult/ TODO
* getPublishedElections/ TODO
*
* candidate/
* candidate/id TODO
*
* voter/
* */

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
