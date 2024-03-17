const express = require('express')
const postRouter = express.Router()

const {
    getPosts,
    createPost,
    likePost,
    savePost,
    commentPost
} = require('../controllers/postController')
const upload = require('../utils/storage')

postRouter.route('/')
    .get(getPosts)
    .post(upload.single('image'), createPost)

postRouter.patch('/:postId/like', likePost)
postRouter.patch('/:postId/save', savePost)
postRouter.patch('/:postId/comment', commentPost)

module.exports = postRouter