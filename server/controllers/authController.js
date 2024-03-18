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

    const isPasswordCurrect = user.comparePassword(password)
    if (!isPasswordCurrect)
        throw new CustomError('Wrong password', 400)

    const token = user.createToken()
    res.status(201).json({ success: true, data: { token } })
}

const register = async (req, res) => {
    if (!req.file)
        throw new CustomError('no image selected', 400)

    console.log(req.file)
    res.status(201).json({ success: true, msg: 'ok' })
    // const refPath = ref(
    //     getStorage(),
    //     `profiles/${uuidv4()}.${path.extname(req.file.originalname)}`
    // )
    // const result = await uploadBytes(refPath, req.file)
    // const image = await getDownloadURL(result.ref)

    // const user = await User.create({ ...req.body, image })
    // const token = user.createToken()

    // res.status(201).json({ success: true, data: { token } })
}

module.exports = {
    login,
    register
}