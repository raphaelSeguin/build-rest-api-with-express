const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    postedOn: {
        type: Date,
        default: Date.now
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: String
})

module.exports = reviewSchema;