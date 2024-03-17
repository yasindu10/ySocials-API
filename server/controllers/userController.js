const User = require('../models/User')
const CustomError = require('../errors/customErrors')

const getUsers = async (req, res) => {
    const { id, search } = req.query

    const queryObject = {}

    if (id)
        queryObject._id = id

    if (search) {
        queryObject.username = {
            $regex: search,
            $options: "i"
        }
    }

    const users = await User.find(queryObject)
    res.status(200).json({ success: true, data: users })
}

const followUnFollowUser = async (req, res) => {
    const user = await User.findOne({ _id: req.params.userId })
    const currentUser = await User.findOne({ _id: req.user.userId })

    if (user.followers.includes(user)) {
        await user.updateOne(
            { "$pull": { followers: currentUser._id } },
            { new: true, runValidators: true }
        )
        await currentUser.updateOne(
            { "$pull": { following: user._id } },
            { new: true, runValidators: true }
        )
        res.status(200).json({ success: true, data: 'unFollowed' })
    } else {
        await user.updateOne(
            { "$push": { followers: currentUser._id } },
            { new: true, runValidators: true }
        )
        await currentUser.updateOne(
            { "$push": { following: user._id } },
            { new: true, runValidators: true }
        )
        res.status(200).json({ success: true, data: 'Followed' })
    }
}

const followUser = async (req, res) => {
    const user = await User.findOne({ _id: req.params.userId })
    const currentUser = await User.findOne({ _id: req.user.userId })

    if (user.followers.includes(user))
        throw new CustomError('Already Followed', 400)

    await user.updateOne(
        { "$push": { followers: currentUser._id } },
        { new: true, runValidators: true }
    )
    await currentUser.updateOne(
        { "$push": { following: user._id } },
        { new: true, runValidators: true }
    )
    res.status(200).json({ success: true, data: 'Followed' })
}

const unFollowUser = async (req, res) => {
    const user = await User.findOne({ _id: req.params.userId })
    const currentUser = await User.findOne({ _id: req.user.userId })

    if (!user.followers.includes(user))
        throw new CustomError('Already unFollowed', 400)

    await user.updateOne(
        { "$pull": { followers: currentUser._id } },
        { new: true, runValidators: true }
    )
    await currentUser.updateOne(
        { "$pull": { following: user._id } },
        { new: true, runValidators: true }
    )
    res.status(200).json({ success: true, data: 'unFollowed' })
}

module.exports = { getUsers, followUser, unFollowUser }