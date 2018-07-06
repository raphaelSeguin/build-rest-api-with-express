const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');
const auth     = require('basic-auth');

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

// This hook hashes the user password with a salt
userSchema.pre('save', function(next) {
    const saltRounds = 10;
    const myPlaintextPassword = this.password;

    bcrypt.genSalt(saltRounds, (err, salt) => {
        return bcrypt.hash(myPlaintextPassword, salt, (err, hash) => {
            if (err) {
                next(err);
            } else {
                this.password = hash;
                next();
            }
        });
    });
});

// Static method to authenticate a user
// compare password hash to the hash stored on the db
// passes the user document to the callback if user is authentic
// passes an error object otherwise
userSchema.static('authenticate', function (email, password, callback) {
    return this.findOne({ emailAddress: email })
        .then(
            user => {
                if (user) {
                    bcrypt.compare( password, user.password )
                        .then(
                            res => res
                                ? callback( null, user ) 
                                : callback( new Error('Wrong password') ),

                            err => callback( new Error(err.message) )
                        )
                } else {
                    const err = new Error('Invalid user name or password');
                    callback( err );
                }
            }
        );
});

module.exports = userSchema;