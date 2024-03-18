require('express-async-errors')
require('dotenv').config()

const express = require('express')
const app = express()

const connectDB = require('./db/connectDb')
const errorHandeller = require('./middleware/errorHandeller')
const { authorization } = require('./middleware/authorization')

const firebase = require('firebase/app')
const cors = require('cors')

const authRouter = require('./routers/authRouter')
const postRouter = require('./routers/postRouter')
const userRouter = require('./routers/userRouter')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: "*" }))

firebase.initializeApp(require('./firebase/config'))

app.use('/api/v1/auth', authRouter)
app.use(authorization) // authorization
app.use('/api/v1/post', postRouter)
app.use('/api/v1/user', userRouter)

// error handeller
app.use(errorHandeller)

const port = process.env.PORT || 8080
const start = async () => {
    await connectDB(process.env.MONGO_URL)
    app.listen(port, () => {
        console.log(`server is listening to port ${port}`)
    })
}
start()