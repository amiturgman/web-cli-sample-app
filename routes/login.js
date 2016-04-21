var express = require('express');
var app = express();

module.exports = function (passport) {

    app.get('/login', passport.authenticate('google', { scope : ['https://www.googleapis.com/auth/plus.profile.emails.read'] }));
    
    // the callback after google has authenticated the user
    app.get('/.auth/login/google/callback',
            passport.authenticate('google', {
            successRedirect : '/',
            failureRedirect : '/login'
    }));

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    return app;
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();
    
    // if they aren't redirect them to the home page
    //res.redirect('/');
    return res.status(401).json({ error: 'user not logged in' });
}