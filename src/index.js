'use strict';

// load modules
const express    = require('express');
const morgan     = require('morgan');
const mongoose   = require('mongoose');
const bodyparser = require('body-parser');
const auth       = require('basic-auth');

const User   = require('./models').User;
const Course = require('./models').Course;
const Review = require('./models').Review;

// Routes
const routes = require('./routes.js');

// mongoose connection returns a Promise which possible rejection needs to be handled.
mongoose.connect('mongodb://localhost:27017/course-api')
    .catch( err => console.log(err.message));

const db = mongoose.connection;

db.on('error', err => console.log('db connection error :') );
db.once('open', function() {
    console.log('connected successfully');
});

// Express app
const app = express();

// set our port
app.set('port', process.env.PORT || 5000);
app.set('view engine', 'pug');

// morgan gives us http request logging
app.use( morgan('dev') );
app.use( bodyparser.json() );

// put credentials in req object's user key
app.use( (req, res, next) => {
    req.user = auth(req);
    next();
})

// send a friendly greeting for the root route
app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to the Course Review API'
    });
  });

app.use('/api', routes);

// send 404 if no other route matched
app.use((req, res) => {
    res.status(404).json({
      message: 'Route Not Found'
    })
  })

// global error handler
app.use((err, req, res, next) => {
    //console.error(err.stack);
    res.status(err.status || 500).json({
      message: err.message
    });
  });

// 
app.disable('x-powered-by');

// start listening on our port
var server = app.listen(app.get('port'), function() {
  console.log('Express server is listening on port ' + server.address().port);
});
