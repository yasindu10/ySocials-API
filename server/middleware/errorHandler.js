const CustomError = require('../errors/customErrors')

const errorHandeller = (err, req, res, next) => {
    if (err instanceof CustomError)
        return res.status(err.stateCode).json({ success: false, msg: err.message })

    console.log(err.message)
    res.status(500).json({ success: false, msg: err.message })
}

module.exports = errorHandeller