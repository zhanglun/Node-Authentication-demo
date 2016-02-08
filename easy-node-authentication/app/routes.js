module.exports = function(app, passport) {
  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  app.get('/', function(req, res) {
    res.render('index'); // load the index.ejs file
  });

  // =====================================
  // LOGIN ===============================
  // =====================================
  // show the login form
  app.get('/login', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('login.ejs', {
      message: req.flash('loginMessage')
    });
  });

  // process the login form
  // app.post('/login', do all our passport stuff here);

  // =====================================
  // SIGNUP ==============================
  // =====================================
  // show the signup form
  app.get('/signup', function(req, res) {
    console.log('signup');
    // render the page and pass in any flash data if it exists
    res.render('signup.ejs', {
      message: req.flash('signupMessage')
    });
  });

  // process the signup form
  // app.post('/signup', do all our passport stuff here);

  // =====================================
  // PROFILE SECTION =====================
  // =====================================
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
      user: req.user // get the user out of session and pass to template
    });
  });

  // =====================================
  // LOGOUT ==============================
  // =====================================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.post('/signup', function(req, res, next) {
    passport.authenticate('local-signup', function(err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect('/signup');
      }
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        console.log(user);
        return res.redirect('/users/@' + user.local.email);
      });
    })(req, res, next);
  });

  app.post('/login', function(req, res, next){
    passport.authenticate('local-login', function(err, user, info){
      if(err){
        return next(err);
      }
      if(!user){
        return res.redirect('/login');

      }
      req.logIn(user, function(err){
        if(err){
          return next(err);
        }
        console.log(user);
        return res.redirect('/profile');
      });
    })(req, res, next);
  });

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) {
    return next();
  } else {
    // if they aren't redirect them to the home page
    res.redirect('/');
  }

};
