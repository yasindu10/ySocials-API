const User = require('../models/User')
const CustomError = require('../errors/customErrors')
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage')
const { v4: uuidv4 } = require('uuid')
const path = require('path')

const login = async (req, res) => {
    const { username, password } = req.body

    if (!username || !password)
        throw new CustomError('please enter username and password', 404)

    const user = await User.findOne({ username })
    if (!user)
        throw new CustomError(`No user with username: ${username}`, 404)

    const isPasswordCurrent = await user.comparePassword(password)
    if (!isPasswordCurrent)
        throw new CustomError('Wrong password', 400)

    const currentUser = user.toJSON()
    delete currentUser.password

    const token = user.createToken()
    res.status(201).json({
        success: true, data: {
            token,
            user: currentUser
        }
    })
}

const register = async (req, res) => {
    if (!req.file)
        throw new CustomError('no image selected', 400)

    const refPath = ref(
        getStorage(),
        `profiles/${uuidv4()}${path.extname(req.file.originalname)}`
    )

    // Set content type based on the file extension or mime type
    const contentType = req.file.mimetype || 'image/jpeg';
    const result = await uploadBytes(refPath, req.file.buffer, { contentType })
    const image = await getDownloadURL(result.ref)

    const user = await User.create({ ...req.body, image })
    const currentUser = user.toJSON()
    delete currentUser.password

    res.status(201).json({
        success: true, data: {
            user: currentUser
        }
    })
}

module.exports = {
    login,
    register
}