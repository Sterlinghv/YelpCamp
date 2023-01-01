const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');

//serve register form
router.get('/register', (req, res) => {
    res.render('users/register')
});

//post a new registered user
router.post('/register', catchAsync(async (req, res, next) => {
    try{
    const {email, username, password} = req.body;
    const user = new User({email, username});
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
        if(err) return next(err);
        req.flash('success', 'Welcome to YelpCamp!');
        res.redirect('/campgrounds');
    })
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('register');
    };
}));

//serve login form
router.get('/login', (req, res) => {
    res.render('users/login');
});

//post log in (actually log in)
router.post('/login', passport.authenticate('local', 
            {
                failureFlash: true, 
                failureRedirect: '/login',
                failureMessage: true,
                keepSessionInfo: true
            }
    ), (req, res) => {
    req.flash('success', 'Welcome back!');
    
    //returns user to route they were first attepting to go to
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

//log user out route
router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('success', "Logged out!");
      res.redirect('/campgrounds');
    });
}); 

module.exports = router;