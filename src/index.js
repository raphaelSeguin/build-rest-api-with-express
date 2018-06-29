'use strict';

// load modules
const express    = require('express');
const morgan     = require('morgan');
const mongoose   = require('mongoose');
const bodyparser = require('body-parser');
const session    = require('express-session');
const auth       = require('basic-auth');

const seeder = require('./seeder');

const User   = require('./models').User;
const Course = require('./models').Course;
const Review = require('./models').Review;

// Routes
const routes = require('./routes.js');

// mongoose connection returns a Promise which possible rejection needs to be handled.
mongoose.connect('mongodb://localhost:27017/course-api')
    .catch( err => console.log(err.message));

const db = mongoose.connection;

db.on('error', err => console.log('connection error :') );
db.once('open', function() {
    console.log('connected successfully');
    //seeder(db, data);

    // const joesmith = new User ({
    //     "_id": "57029ed4795118be119cc437",
    //     "fullName": "Joe Smith",
    //     "emailAddress": "joe@smith.com",
    //     "password": "password"
    // });
    // joesmith.save( function( err, user) {
    //     if (err) { return console.log( err.message ); }
    //     console.log(user);
    // })
});

// Express app
const app = express();

// set our port
app.set('port', process.env.PORT || 5000);
app.set('view engine', 'pug');

// morgan gives us http request logging
app.use( morgan('dev') );
app.use( bodyparser.json() );
app.use( session({
    secret: 'project11',
    resave: true,
    saveUninitialized: false,
    cookie: { secure: true }
  })
);

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
    console.error(err.stack);
    res.status(err.status || 500).json({
      message: err.message,
      error: {}
    });
  });


// 
app.disable('x-powered-by');

// start listening on our port
var server = app.listen(app.get('port'), function() {
  console.log('Express server is listening on port ' + server.address().port);
});
