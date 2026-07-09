const mongoose = require('mongoose')

const showtimeSchema = new mongoose.Schema({
    movie : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "movie",
        required : true
    },
    theatre : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "theatre",
        required : true
    },
    screen : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "screen",
        required : true
    },
    date : {
        type : Date, 
        required : true
    },
    startTime : {
        type : Date,
        required : true
    },
    endTime : {
        type : Date,
        required : true
    },
    price : {
        type : Number,
        required : true,
        default : 0
    },
    bookedSeats : [{
        seatNumber : {
            type : String ,
            required : true
        },
        user : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "user"
        }
    }],
    status : {
        type : String, 
        enum: ["ACTIVE", "CANCELLED", "COMPLETED"],
        default : "ACTIVE"
    }
}, {
    timestamps : true
})

const showtTimeModel = mongoose.model("showTime", showtimeSchema)

module.exports = showtTimeModel