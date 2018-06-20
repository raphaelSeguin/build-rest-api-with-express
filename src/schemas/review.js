const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    _id: Schema.Types.ObjectId,
    user: Schema.Types.ObjectId,
    postedOn: {
        type: Date,
        default: Date.now()
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    review: String
})

module.exports = reviewSchema;