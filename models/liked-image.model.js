const mongoose = require('mongoose')
const LikedImageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        max: 100,
    },
    explanation: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    }
})

module.exports = mongoose.model('LikedImageModel', LikedImageSchema)