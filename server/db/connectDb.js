const mongoose = require('mongoose')

const connectDB = async (URL) => {
    return await mongoose.connect(URL)
}

module.exports = connectDB