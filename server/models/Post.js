const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    authorId: {
        type: String,
        required: true,
    },
    likes: {
        type: [],
        default: []
    },
    comments: {
        type: [Object], /** { userId : ----, date : May 13, 2024, likes : [userId : ---] } */
        default: []
    },
    date: {
        type: Date,
        default: new Date(),// get the current date
    },
    description: {
        type: String,
        default: '',
    },
    saved: {
        type: [], /** userId : ----- */
        default: []
    },
    image: {
        type: String,
        required: 'no image selected'
    }
})

module.exports = mongoose.model('Posts', schema)