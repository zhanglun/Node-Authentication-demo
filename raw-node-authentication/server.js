// server.js

// set up ======================================================================
// get all the tools we need
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

db = mongoose.connection;
db.on('error', function(err) {
  console.log('database connection failed!: ' + err);
});

db.on('open', function() {
  console.log('database opened!!');
});

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(flash());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('views', __dirname + '/app/views');
app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
  secret: 'ilovescotchscotchyscotchscotch',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
})); // session secret

// routes ======================================================================
require('./app/routes.js')(app); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
