const loginCtrl = (request, response, next) => {
    const loginServices = require('../services/userServices');

    let pseudoname = request.body.auser.pseudoname;
    let email = request.body.auser.contact;

    loginServices.loginService(pseudoname, email, function(err, oldy, user) {
        console.log("User from login service :" + JSON.stringify(user));
        if (user === null) {
            console.log("Auhtentication problem!");
            response.json(null);
        } else {
            console.log("Auhtentication went through!");
            if (oldy === true) {
                console.log(`Hello ${pseudoname}, welcome back!`);
            } else {
                console.log(`Hello ${pseudoname}, you have been registred!`);
                console.log(`Your id is ${user.id}!`);
            }
            response.json({ old: oldy, obj: user });
        }
        response.end();
        next();
    });
};

const getUsers = (request, response) => {
    const loginServices = require('../services/userServices');
    loginServices.searchService(function(err, rows) {
        response.json(rows);
        response.end();
    });
};

const getUserByID = (request, response) => {
    const loginServices = require('../services/userServices');
    let id = request.params.id;
    loginServices.searchIDService(id, function(err, rows) {
        response.json(rows);
        response.end();
    });
};

module.exports = {
    loginCtrl,
    getUsers,
    getUserByID
};