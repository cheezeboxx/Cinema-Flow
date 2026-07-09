const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

    showtime: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "showTime",
        required: true
    },

    seats: [{
        type: String,
        required: true
    }],

    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },

    status: {
        type: String,
        enum: ["BOOKED", "AVAILAIBLE", "CANCELLED"],
        default: "AVAILAIBLE"
    }

}, {
    timestamps: true
});

const reservationModel = mongoose.model("reservation", reservationSchema);

module.exports = reservationModel;