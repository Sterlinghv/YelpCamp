const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegister) //serve register form
    .post(catchAsync(users.register)); //post a new user

router.route('/login')
    .get(users.renderLogin) //serve login form
    .post(passport.authenticate('local', //post a login
            {
                failureFlash: true, 
                failureRedirect: '/login',
                failureMessage: true,
                keepSessionInfo: true
            }
    ), users.login);


//log user out route
router.get('/logout', users.logout); 

module.exports = router;