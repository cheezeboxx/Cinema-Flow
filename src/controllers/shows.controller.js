const showTimeModel = require('../models/showtime.model')
const movieModel = require('../models/movie.model')
const theatreModel = require('../models/theatre.model')
const screenModel = require('../models/screen.model')

async function createShowTime(req, res) {

    try {
        const { movieId, theatreId, screenId, date, startTime, endTime, 
            price, bookedSeats, status = "ACTIVE"
        } = req.body;

        const movie = await movieModel.findById(movieId)
        if(!movie) {
            return res.status(404).json({
                message : "Movie does not exist"
            })
        }
        const theatre = await theatreModel.findById(theatreId)
        if(!theatre) {
            return res.status(404).json({
                message : "Theatre does not exist"
            })
        }

        if(req.user.role === "theatre_manager" && !theatre.managedBy.equals(req.user.userId)) {
            return res.status(403).json({
                message : "Unauthorised. You can only manage your own theatre"
            })
        }

        const screen = await screenModel.findById(screenId).populate('theatre')
        if(!screen) {
            return res.status(404).json({
                message : "Screen does not exist"
            })
        }

        if(screen.theatre._id.toString() !== theatreId) {
            return res.status(400).json({
                message : "Screen does not belong to this theatre"
            })
        }

        const overlappingShows = await showTimeModel.findOne({
            screen : screenId,
            date,
            status : "ACTIVE",
            $or : [
                {startTime : { $lt : endTime }, endTime : { $gt : startTime }}
            ]
        })

        if(overlappingShows) {
            return res.status(409).json({
                message : "Overlapping shows exist"
            })
        }

        const showTime = await showTimeModel.create({
            movie, theatre, screen, date, startTime, endTime, 
            price, bookedSeats: [], status
        })

        res.status(201).json({
            message : "ShowTime created",
            showTime
        })
    } catch (err) {

        console.log(err);
        return res.status(500).json({
            message : "Internal Server Error"
        })

    }
}

async function getAllShowTimes(req, res) {

    try {

        const { movie, theatre, date } = req.query;

        const filter = { status : "ACTIVE" }

        if(movie) filter.movie = movie;
        if(theatre) filter.theatre = theatre;

        if(date) {
            const start = new Date(date)
            start.setHours(0, 0, 0, 0)
            const end = new Date(date)
            end.setHours(23, 59, 59, 999)
            filter.date = { $gte : start, $lte : end }
        }

        const showtimes = await showTimeModel.find(filter)
            .populate('movie', 'title poster duration')
            .populate('theatre', 'theatreName city')
            .populate('screen', 'screenName')
            .sort({ date : 1, startTime : 1 })

        res.status(200).json({
            message : "Fetched all showtimes",
            totalShowTimes : showtimes.length,
            showtimes
        })

    } catch (err) {

        console.log(err)

        return res.status(500).json({
            message : "Internal Server Error"
        })

    }
}

module.exports =  {
    createShowTime,
    getAllShowTimes
}