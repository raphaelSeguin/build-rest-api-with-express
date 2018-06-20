const mongoose = require('mongoose');
const userSchema = require('./schemas/user');
const courseSchema = require('./schemas/course');
const reviewSchema = require('./schemas/review');

// models

const User = mongoose.model('User', userSchema);
const Course = mongoose.model('Course', courseSchema);
const Review = mongoose.model('Review', reviewSchema);

module.exports.User = User;
module.exports.Course = Course;
module.exports.Review = Review;