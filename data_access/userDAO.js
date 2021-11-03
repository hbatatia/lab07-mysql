const db = require('./db_manager');

function find(callback) {
    const selectUsers = "SELECT * from groupchat.users; ";
    db.getResult(selectUsers, function(err, rows) {
        if (!err) {
            callback(null, rows);
        } else {
            console.log(err);
        }
    });
}



function findByEmail(email, callback) {
    const selectUser = (`SELECT * from groupchat.users where email like '${email}';`);
    db.getResult(selectUser, function(err, rows) {
        if (!err) {
            callback(null, rows);
        } else {
            console.log(err);
        }
    });
}

function findById(id, callback) {
    const selectUser = (`SELECT * from groupchat.users where id = ${id};`);
    db.getResult(selectUser, function(err, rows) {
        if (!err) {
            callback(null, rows);
        } else {
            console.log(err);
        }
    });
}

function createUser(pseudoname, email, callback) {
    const insertUser = (`INSERT INTO groupchat.users (pseudoname, email) VALUES (${pseudoname}, ${email}) ;`);
    db.getResult(insertUser, function(err, result) {
        if (!err) {
            callback(null, result.affectedRows, result.insertId);
        } else {
            console.log(err);
        }
    });
}


function deleteUser(id, callback) {
    const insertUser = (`DELETE from groupchat.users where id = ${id};`);
    db.getResult(selectUser, function(err, result) {
        if (!err) {
            console.log("Number of users inserted: " + result.affectedRows);
            callback(null, result.affectedRows);
        } else {
            console.log(err);
        }
    });
}


module.exports = {
    find,
    findByEmail,
    findById,
    createUser,
    deleteUser
};