const createError = require('http-errors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const logger = require('morgan');

// Require environment variables
require('dotenv').config();

const mongoose = require('mongoose');

// Create express app
var app = express();

// app.use defines middlewares that requests pass through first
// before they are sent out in different route handlers

// Cors
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

// calling cookie session and passing a configuration object
// 1: how long will the cookie last (30 days in ms)
// 2: For encrypting a cookie, not to commit so we add it on config/keys
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [process.env.cookieKey]
  })
);

// Use native promise library on mongoose
// mongoose.Promise = global.Promise;

// Use bluebird library on mongoose
mongoose.Promise = require('bluebird');

// Attempt to connect to database
mongoose.connect(process.env.mongodbUrl);

// On connection success/error
mongoose.connection.on('error', function() {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});
mongoose.connection.once('open', function() {
    console.log("Successfully connected to the database");
})

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= //
//                                       //
//                ROUTES                 //
//                                       //
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= //

// Cocktail routes
require('./app/routes/cocktail.routes.js')(app);


//
if (process.env.PORT) {
  console.log('*** Running in production ***');
  // Express will serve up production assets
  // Like main.js or main.css files
  app.use(express.static('client/build'));

  // Express will serve up the index.html file
  // If it doesnt recognize the route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Various middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
/*
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  
});
*/

const PORT = process.env.PORT || 8001;
app.listen(PORT);
