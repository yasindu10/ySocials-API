const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const schema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: 'user name is required',
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: 'password is required',
    },
    image: {
        type: String,
        required: 'profile picture is required',
    },
    profession: {
        type: String,
    },
    followers: {
        type: [String],
    },
    following: {
        type: [String],
    },
    role: {
        type: String,
        enum: ['user', 'proUser', 'admin'],
        default: 'user',
        required: 'please enter a role'
    },
})

schema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

schema.methods.comparePassword = async function (currentPassword) {
    return await bcrypt.compare(currentPassword, this.password)
}

schema.methods.createToken = function () {
    const token = jwt.sign({
        userId: this._id,
        email: this.email,
        role: this.role,
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '30d'
    })
    return token
}

module.exports = mongoose.model('Users', schema)