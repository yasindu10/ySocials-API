const express = require('express')
const authRouter = express.Router()

const {
    login,
    register
} = require('../controllers/authController')
const upload = require('../utils/storage')

authRouter.post('/login', login)
authRouter.post('/register', upload.single('image'), register)

module.exports = authRouter
