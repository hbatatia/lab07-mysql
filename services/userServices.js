const { User } = require('../models/entities');
const userDAO = require('../daos/userDAO');

const loginService = (pseudoname, email, callback) => {
    //check if the user is in the DB
    userDAO.findByEmail(email, function(err, rows) {
        if (rows.length == 0) {
            //the user is not in the DB
            console.log("new user, try insert");
            //insert user in the DB
            userDAO.createUser(pseudoname, email, function(err, affectedRows, insertId) {
                console.log(`Insertion  from DAO : ${affectedRows}, ${insertId}`);
                if (affectedRows != 0) {
                    console.log(`new user ${insertId}, ${pseudoname}, ${email}`);
                    user = new User(insertId, pseudoname, email);
                    callback(null, false, user);
                }
            });
        } else {
            console.log(`Old user ${rows[0].id}, ${rows[0].pseudoname}, ${rows[0].email}`);
            user = new User(rows[0].id, rows[0].pseudoname, rows[0].email);
            callback(null, true, user);
        }
    });
};


const searchService = function(callback) {
    userDAO.find(function(err, rows) {
        if (rows.length == 0) {
            console.log("No users!");
        } else {
            callback(null, rows);
        }
    });
};

const searchIDService = function(id, callback) {
    userDAO.findById(id, function(err, rows) {
        if (rows.length == 0) { //unkown
            console.log("Unkown user!");
            let user = null;
            calback(null, user);
        } else {

            let user = new User(rows[0].id, rows[0].pseudoname, rows[0].email);
            callback(null, user);
        }
    });
};

const deleteService = function(id, callback) {
    let count = userDAO.deleteUser(id, function(err, count) {
        if (count === 0) { //unkown
            console.log("No user deleted!");
            callback(null, false);
        } else {
            callback(null, true);
        }
    });
};

module.exports = {
    loginService,
    searchIDService,
    searchService,
    deleteService
};