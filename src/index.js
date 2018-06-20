'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const seeder = require('mongoose-seeder');

//mongoose.Promise = global.Promise;   // ?????????????????

const User = require('./models').User;
const Course = require('./models').Course;
const Review = require('./models').Review;

//console.log(User);

// Data
const data = require('./data/data.json');

// Routes
const routes = require('./routes.js');

// mongoose
mongoose.connect("mongodb://localhost:27017/mydb")
const db = mongoose.connection;

db.on('error', err => console.log('connection error') );
db.once('open', function() {
    console.log('connected successfully');
    
    const usus = new User({
      fullName: 'azefaze azeaze',
      emailAddress: 'azer@azer.com',
      password: 'IUHAIDUHAZ'
    })



    // seeder.seed(data, {dropCollections: true})
    // .then( 
    //     function( dbData ) {
    //         console.log('db seeded');
    //     }
    // ).catch( 
    //     function( err ) {
    //         console.log('error in seeding', err.message);
    //     }
    // );
});

// Express app
const app = express();

// set our port
app.set('port', process.env.PORT || 5000);
app.set('view engine', 'pug');

// morgan gives us http request logging
app.use(morgan('dev'));

// setup our static route to serve files from the "public" folder
app.use('/', express.static('public'));

app.use('/api', routes);

// catch 404 and forward to global error handler
app.use(function(req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
});

// Express's global error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// start listening on our port
var server = app.listen(app.get('port'), function() {
  console.log('Express server is listening on port ' + server.address().port);
});
