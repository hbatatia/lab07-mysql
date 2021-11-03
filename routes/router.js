const express = require('express');
//const app = express();
const userController = require('../controllers/userController');


//define a router and create routes
const chatRouter = express.Router();
//create a route for /api/login
chatRouter.post('/api/login', userController.loginCtrl);
//create a route for /api/users
chatRouter.get('/api/users', userController.getUsers);
//create a route with /api/users/id
chatRouter.get('/api/users/:id', userController.getUserByID);

//export router
module.exports = chatRouter;