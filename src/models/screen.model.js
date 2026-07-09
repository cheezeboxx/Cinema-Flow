const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
    theatre : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "theatre",
        required : [true, "theatre is required"]
    },
    screenName : {
        type : String, 
        required : [true, "Screen name is required"]
    },
    capacity : {
        type : Number,
        required : [true, "Capacity is must"],
        default : 10
    }
}, {
    timestamps : true
})

const screenModel = mongoose.model("screen", screenSchema)


module.exports = screenModel;