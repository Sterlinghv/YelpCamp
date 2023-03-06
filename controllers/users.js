const User = require('../models/user');

//render the register form page
module.exports.renderRegister = (req, res) => {
    res.render('users/register')
};

//register a user
module.exports.register = async (req, res, next) => {
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
};

//render the login form page
module.exports.renderLogin = (req, res) => {
    res.render('users/login');
};

//logs a user in
module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    
    //returns user to route they were first attepting to go to
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

//logs a user out
module.exports.logout = (req, res, next) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('success', "Logged out!");
      res.redirect('/campgrounds');
    });
};