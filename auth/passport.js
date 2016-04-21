var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var config = require('../config');
var googleConfig = config.auth.google;
var users = require('./users');

module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(userProfile, cb) {
        return cb(null, userProfile);
    });

    // used to deserialize the user
    passport.deserializeUser(function (userProfile, cb) {
        return cb(null, userProfile);
    });
        
    passport.use('google', new GoogleStrategy(googleConfig,
        function(token, refreshToken, profile, cb) {
            // make the code asynchronous
            // User.findOne won't fire until we have all our data back from Google
            process.nextTick(function() {
            
            var userProfile = {
                name: profile.displayName,
                email: profile.emails[0].value,
                image: profile.photos.length && profile.photos[0] && profile.photos[0].value
            };

            if (!config.users.enabled)
                // user is authenticated but authorization feature is disabled 
                return cb(null, userProfile);

            users.getUser({ email: userProfile.email }, function(err, user) {
              if (err) {
                console.error('error trying to get user', userProfile.email, err);
              }

              // first time master admin logs in, let's add it to storage
              if (!user && userProfile.email === googleConfig.adminAccount) {
                return users.upsertUser({
                  email: userProfile.email,
                  name: userProfile.name,
                  addedBy: userProfile.email
                }, function(err) {
                  if (err) console.error('error adding admin user', userProfile.user, err);
                  userProfile.authorized = true;
                  return cb(null, userProfile);    
                });
              }

              userProfile.authorized = !!user;
              return cb(null, userProfile);
            });
        });
    }));
};
