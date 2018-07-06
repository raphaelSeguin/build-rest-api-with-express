const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stepSchema = new Schema({
    stepNumber: Number,
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});
  
const courseSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User'},
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    estimatedTime: String,
    materialsNeeded: String,
    steps: [stepSchema],
    reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}]
})

module.exports = courseSchema;