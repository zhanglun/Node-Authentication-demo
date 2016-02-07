var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('../app/models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(username, password, done) {
      User.findOne({
        'local.email': username
      }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, false, req.flash('singupMessage', 'That email is already taken.'));
        } else {
          // if there is no user with that email
          // create the user
          var newUser = new User();

          // set the user's local credentials
          newUser.local.email = username;
          newUser.local.password = newUser.generateHash(password);

          // save the user
          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }

      });
    }));

};
