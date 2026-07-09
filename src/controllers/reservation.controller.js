const reservationModel = require('../models/reservation.model')
const showTimeModel = require('../models/showtime.model')
const userModel = require('../models/user.model')
const movieModel = require('../models/movie.model')
const theatreModel = require('../models/theatre.model')
const screenModel = require('../models/screen.model')

async function getAvailaibleSeats(req, res) {

    try {

        const { showTimeId } = req.params;

        const show = await showTimeModel.findById(showTimeId).populate('screen')

        if(!show) {
            return res.status(404).json({
                message : "Such show time does not exist"
            })
        }

        const totalSeats = show.screen.capacity;

        const allSeats = [];

        for(let i = 1; i <= totalSeats; i++) {
            allSeats.push(String(i))
        }

        const bookedSeatNumbers =  show.bookedSeats.map( seat => seat.seatNumber )
        const availaibleSeats = allSeats.filter( seats => !bookedSeatNumbers.includes(seats) )
        
        return res.status(200).json({
            message : "Seats Fetched successfully",
            totalSeats,
            bookedCount : bookedSeatNumbers.length,
            availaibleCount : availaibleSeats.length,
            availaibleSeats
        })

    } catch (err) { 

        console.log(err);

        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

async function createReservation(req, res) {

    try { 

        const { showTimeId } = req.params;
        const { seatsBooked }  = req.body;
        const userId = req.user.userId;

        if(!seatsBooked || seatsBooked.length === 0) {
            return res.status(400).json({ message : "You need to book some seats" })
        }

        const show  = await showTimeModel.findById(showTimeId).populate('movie').populate('screen')

        if(!show) {
            return res.status(404).json({
                message : "Such show time does not exist"
            })
        }

        if(show.status !== "ACTIVE") {
            return res.status(404).json({ message : "Showtime is not availaible for booking" })
        }

        const movieId = show.movie._id;
        const isMovieExist = await movieModel.findById(movieId);
        if(!isMovieExist) {
            return res.status(404).json({
                message : "Movie does not exist"
            })
        }

        const theatreId = show.theatre._id;
        const isTheatreExist = await theatreModel.findById(theatreId);
        if(!isTheatreExist) {
            return res.status(404).json({
                message : "Theatre does not exist"
            })
        }

        const screenId = show.screen._id;
        const isScreenExist = await screenModel.findOne({ _id : screenId, theatre : theatreId});
        if(!isScreenExist) {
            return res.status(404).json({
                message : "Screen does not exist"
            })
        }


        // validating the seats that are selected
        const totalSeatNumbers = show.screen.capacity;
        const uniqueSeatsBooked = [...new Set(seatsBooked)]
        const invalidSeats = []

        for(let i = 0; i < uniqueSeatsBooked.length; i++) {
            const seat = uniqueSeatsBooked[i];
            const num = Number(seat);

            if(isNaN(num) || num < 1 || num > totalSeatNumbers) {
                invalidSeats.push(seat)
            }
        }

        if(invalidSeats.length > 0) {
            return res.status(400).json({
                messsage : "Seat selected is invalid",
                invalidSeats
            })
        }

        // Atomic check and book the seats 
        // it will only continue iff the seats selected are not in bookedSeats

        const updatedShowTime = await showTimeModel.findOneAndUpdate(
            { 
                _id : showTimeId,  
                "bookedSeats.seatNumber" : { $nin : uniqueSeatsBooked }
            },
            {
                $push : {
                    bookedSeats : {
                        $each : uniqueSeatsBooked.map(seat => ({
                            seatNumber: seat,
                            user: userId
                        }))
                    }
                }
            },
            {
                // new : true
                returnDocument : "after"
            }
        )


        if(!updatedShowTime) {
            return res.status(409).json({
                message : "Seats are already booked"
            })
        }

        const totalPrice = show.price * uniqueSeatsBooked.length;

        const reservation = await reservationModel.create({
            user : userId, 
            showtime : showTimeId,
            seats :  uniqueSeatsBooked,
            totalAmount : totalPrice,
            status : "BOOKED"

        })


        return res.status(201).json({
            message : "Seats Booked Successfully",
            reservation : reservation
        })




    } catch (err) {
        console.log(err);

        res.status(500).json({ message : "Internal Server Error" })
    }


}

async function cancelReservation(req, res) {

    try {
        const { reservationId } = req.params;
        const user = req.user.userId;


        const reservation = await reservationModel.findById(reservationId)

        if(!reservation) {
            return res.status(404).json({
                message : "There is no reservation with such id"
            })
        }


        const isUser = reservation.user.toString() == user;
        const isAdmin = req.user.role === "admin"

        if(!isUser && !isAdmin) {
            return res.status(401).json({
                message : "You are not authorised to cancel the booking"
            })
        }

        if(reservation.status === "CANCELLED") {
            return res.status(200).json({
                message : "Reservation is already cancelled"
            })
        }

        const showtime = await showTimeModel.findById(reservation.showtime)

        const current = new Date();
        const showStartTime = new Date(showtime.startTime);
        const difference = (showStartTime - current) / (1000 * 60 * 60);

        if(difference < 2) {
            return res.status(400).json({
                message : "Cannot cancel within 2 hours of showtime"
            })
        }

        await showTimeModel.findByIdAndUpdate(
            reservation.showtime,
            {
                $pull : {
                    bookedSeats : { seatNumber : {$in : reservation.seats} }
                }
            }
        )

        reservation.status = "CANCELLED";
        await reservation.save();

        res.status(200).json({
            message: "Reservation cancelled successfully",
            reservation
        })
    } catch (err) {

        console.log(err);

        return res.status(500).json({ message: "Internal Server Error" })

    }


}


module.exports = {
    getAvailaibleSeats,
    createReservation,
    cancelReservation
}