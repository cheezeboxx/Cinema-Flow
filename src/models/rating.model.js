const mongoose = require('mongoose')

const ratingSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
        required : [true, "User is required for the rating"]
    }, 
    movie : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "movie",
        required : [true, "Movie is required for the rating"]
    },
    rating : {
        type : Number, 
        min : 0,
        max : 10, 
        default : 0,
        required : [true, "Rating is required"]
    },
    review : {
        type : String, 
        default : ""
    }
}, {
    timestamps : true
})

ratingSchema.index(
    {user : 1, movie : 1}, 
    { unique : true }
)

const ratingModel = mongoose.model("rating", ratingSchema)

module.exports = ratingModel