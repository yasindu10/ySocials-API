const express = require('express')
const userRouter = express.Router()

const {
    getUsers,
    followUser,
    unFollowUser
} = require('../controllers/userController')

userRouter.get('/', getUsers)
userRouter.patch('/:userId/follow', followUser)
userRouter.patch('/:userId/unFollow', unFollowUser)

module.exports = userRouter