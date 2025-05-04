const mongoose = require('mongoose')
const todoSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: true,
        max: 100,
    },
    done: Boolean
})

module.exports = mongoose.model('todoModel', todoSchema)