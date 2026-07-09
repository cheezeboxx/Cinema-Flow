const express = require('express')
const cookieParser = require('cookie-parser')


const authRouter = require('./routes/auth.routes')
const movieRouter = require('./routes/movie.routes')
const ratingRouter = require('./routes/rating.routes')
const reservationRouter = require('./routes/reservation.routes')
const showTimeRouter = require('./routes/shows.routes')


const app = express()
app.use(express.json())
app.use(cookieParser())


app.use("/api/auth", authRouter)
app.use("/api/movie", movieRouter)
app.use("/api/rate", ratingRouter)
app.use("/api/booking", reservationRouter)
app.use("/api/showtime", showTimeRouter)


module.exports = app