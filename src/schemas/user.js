const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    emailAddress: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(val) {
                return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val);
            }
        }
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.pre('save', function(next) {
    const saltRounds = 10;
    const myPlaintextPassword = this.password;

    bcrypt.genSalt(saltRounds, (err, salt) => {
        console.log('password: ' + this.password + '\nSALT: ' + salt);
        return bcrypt.hash(myPlaintextPassword, salt, (err, hash) => {
            if (err) {
                next(err);
            } else {
                console.log('HASH: ' + hash);
                this.password = hash;
                next();
            }
        });
    });
});

// Create a static method on the user schema that takes an email, password, and callback
// The method should attempt to get the user from the database that matches the email address given.
// If a user was found for the provided email address, then check that user's password against the password given using bcrypt.
//  If they match, then return the user document that matched the email address
// If they don't match or a user with the email given isn’t found, then pass an error object to the callback

userSchema.static('findByEmail', function (email, password, callback) {
    return this.find({ emailAddress: email })
        .then( 
            user => 
                bcrypt.compare( password, user.password )
                    .then(
                        res => res 
                            ? user
                            : callback( new Error() )
                    )
        )
});

module.exports = userSchema;