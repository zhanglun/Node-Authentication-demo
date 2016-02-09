var User = require('./models/user');
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
      message: req.flash('message')
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
      user: req.session.user // get the user out of session and pass to template
    });
  });

  // =====================================
  // LOGOUT ==============================
  // =====================================
  app.get('/logout', function(req, res) {
    req.session.user = null;
    res.redirect('/');
  });

  app.post('/signup', function(req, res, next) {
    var _user = {
      email: req.body.email,
      password: req.body.password
    };
    User.findOne({email: _user.email}, function(err, user){
      if(err){
        throw err;
      }
      if(user){
        req.flash('message', 'User exists!!');
        res.redirect('/signup');
      }else{
        var newUser = new User();
        newUser.email = _user.email;
        newUser.password = newUser.generateHash(_user.password);
        newUser.save(function(err){
          if(err){
            throw err;
          }else{
            req.session.user = user;
            res.redirect('/profile');
          }
        });
      }
    });
  });

  app.post('/login', verifyUser, function(req, res, next) {

  });

  // route for logging out
  app.get('/logout', function(req, res) {
    req.session.user = null;
    res.redirect('/');
  });

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.session.user) {
    return next();
  } else {
    // if they aren't redirect them to the home page
    res.redirect('/');
  }

}

function verifyUser(req, res, next) {
  var _user = {
    email: req.body.email,
    password: req.body.password
  };
  console.log(_user);
  if (!_user.email) {
    req.flash('message', 'Flashed message');
    return res.redirect('/login');
  }
  User.findOne({
    email: _user.email
  }, function(err, user){
    if (user && user.validPassword(_user.password)) {
      // check user password
      req.session.user = user;
      return res.redirect('/profile');
    } else {
      req.flash('message', 'No User!!!');
      return res.redirect('/login');
    }
  });
}
