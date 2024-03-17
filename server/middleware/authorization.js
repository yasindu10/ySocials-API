const CustomError = require('../errors/customErrors')
const jwt = require('jsonwebtoken')

const authorization = (req, res, next) => {
    const authorization = req.headers.authorization

    if (!authorization || !authorization.startsWith("Bearer "))
        throw new CustomError('no access token found', 404)

    const token = authorization.split(' ')[1]
    try {
        const {
            userId, email, role
        } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        req.user = { userId, email, role }
        next()
    } catch (error) {
        throw new CustomError('Forbidden!', 403)
    }
}

module.exports = { authorization } 