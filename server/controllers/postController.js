const Post = require('../models/Post')
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage')
const { v4: uuidv4 } = require('uuid')
const path = require('path')

const getPosts = async (req, res) => {
    const { userId, tag } = req.query
    const queryObject = {}

    if (userId) {
        switch (tag) {
            case 'saved':
                queryObject.saved = userId
                break;
            case 'created':
                queryObject.authorId = userId
                break;
        }
    }
    const posts = Post.find(queryObject)

    const pages = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;

    const finalPosts = await posts.skip((pages - 1) * limit).limit(limit);
    res.status(200).json({ success: true, data: finalPosts })
}

const createPost = async (req, res) => {
    const refPath = ref(
        getStorage(),
        `posts/${uuidv4()}.${path.extname(req.file.originalname)}`
    )
    const result = await uploadBytes(refPath, req.file)
    const imageUrl = await getDownloadURL(result.ref)

    const post = await Post.create({ ...req.body, image: imageUrl })
    res.status(201).json({ success: true, data: post })
}

const likePost = async (req, res) => {
    const post = await Post.findOne({ _id: req.params.postId })
    const userId = req.user.userId

    if (post.likes.includes(userId)) {
        await post.updateOne(
            { "$pull": { likes: userId } },
            { new: true, runValidators: true }
        )
        res.status(200).json({ success: true, data: 'disliked' })
    }
    else {
        await post.updateOne(
            { "$push": { likes: userId } },
            { new: true, runValidators: true }
        )
        res.status(200).json({ success: true, data: 'liked' })
    }
}

const savePost = async (req, res) => {
    const post = await Post.findOne({ _id: req.params.postId })
    const userId = req.user.userId

    if (post.saved.includes(userId)) {
        await post.updateOne(
            { "$pull": { saved: userId } },
            { new: true, runValidators: true }
        )
        res.status(200).json({ success: true, data: 'remove saved' })
    }
    else {
        await post.updateOne(
            { "$push": { saved: userId } },
            { new: true, runValidators: true }
        )
        res.status(200).json({ success: true, data: 'saved' })
    }
}

const commentPost = async (req, res) => {
    const post = await Post.findOne({ _id: req.params.postId })
    const userId = req.user.userId

    await post.updateOne({
        "$push": {
            comments: {
                userId,
                date: new Date(),
                message: req.body.message
            }
        }
    },
        { new: true, runValidators: true }
    )
    res.status(200).json({ success: true, data: "send" })
}

module.exports = {
    getPosts,
    createPost,
    likePost,
    savePost,
    commentPost
}