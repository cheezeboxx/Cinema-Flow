const mongoose = require("mongoose");

const theatreSchema = new mongoose.Schema({
    theatreName: {
        type: String,
        required: [true, "Theatre name is required"],
        trim: true,
    },
    location: {
        type: String,
        required: [true, "Location is required"],
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    managedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
        default : null
    },
    isActive: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

theatreSchema.index({theatreName : 1, location : 1}, {unique : true})

const theatreModel = mongoose.model("theatre", theatreSchema);

module.exports = theatreModel