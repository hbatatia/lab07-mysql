const express = require('express');
var session = require('express-session');
const favicon = require('serve-favicon');
const app = express();
const path = require('path');

//use morgan middleware
//const morgan = require("morgan");
//app.use(morgan('dev'));
app.use(favicon(path.join(__dirname, 'views', 'favicon.ico')));

//define a session
app.use(session({
    secret: 'your secrete word goes here',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
}));


app.use(express.static('views'));
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

//pass requests to the router middleware
const chatRouter = require('./routes/router');
app.use(chatRouter);

//create database if not exists
const createDB = require('./data_access/db_init');
createDB();

//make the app listen on port 
const port = process.argv[2] || process.env.PORT || 3000;
const server = app.listen(port, () => {

    console.log(`Chat app listening at http://localhost:${port}`);
});
const soc = require('./socket');
soc.setSocket(server);