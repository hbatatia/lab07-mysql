const createDb = function() {
    const mysql = require('mysql');
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root"
    });

    connection.connect(function(err) {
        if (err) throw err;
        //create database
        const sqlDB = "CREATE DATABASE IF NOT EXISTS `groupchat`;";
        connection.query(sqlDB, function(err, result) {
            if (err) throw err;
            console.log('The database has been created');
        });
        //change database
        connection.changeUser({ database: 'groupchat' }, function(err) {
            if (err) {
                console.log('error in changing database', err);
                return;
            }
        });

        //create table Payers
        const sqlUser = "Create table if not exists `groupchat`.`users`(" +
            "`id` int(11) NOT NULL auto_increment," +
            "`pseudoname` varchar(32) NOT NULL default 'Unkown'," +
            "`email` varchar(32) NOT NULL," +
            "PRIMARY KEY (`id`)" +
            "); ";
        connection.query(sqlUser, function(err, result) {
            if (err) throw err;
            console.log("Users table created");
        });
        //create table Sessions
        const sqlSession = "Create table if not exists `groupchat`.`sessions` (" +
            "`id` int(11) NOT NULL auto_increment," +
            "`startDate` DATETIME DEFAULT CURRENT_TIMESTAMP," +
            "PRIMARY KEY(`id`)" +
            ");";
        connection.query(sqlSession, function(err, result) {
            if (err) throw err;
            console.log("Sessions table created");
        });
        //create table Participants 
        const sqlParticipant = "Create table if not exists `groupchat`.`participants`(" +
            "`sessionId` int(11) NOT NULL, " +
            "`userId` int(11) NOT NULL, " +
            "`startDate` DATETIME DEFAULT CURRENT_TIMESTAMP, " +
            "`endDate` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , " +
            "`score` int(10) , " +
            "PRIMARY KEY(userId, sessionId), " +
            "FOREIGN KEY (userId) REFERENCES groupchat.users(id), " +
            "FOREIGN KEY (sessionId) REFERENCES groupchat.sessions(id)" +
            ");";
        connection.query(sqlParticipant, function(err, result) {
            if (err) throw err;
            console.log("Participants table created");
        });
    });
};

module.exports = createDb;