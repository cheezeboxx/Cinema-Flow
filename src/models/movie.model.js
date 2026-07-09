const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Movie title is required"],
        unique: true,
        trim: true
    },

    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true
    },

    duration: {
        type: Number,
        required: [true, "Duration is required"],
        min: [1, "Duration must be at least 1 minute"]
    },

    genre: [{
        type: String,
        required: [true, "Genre is required"]
    }],

    language: [{
        type: String,
        required: true,
    }],

    poster: {
        type: String,
        required : true
    },

    trailer: {
        type: String,
        default: ""
    },

    director: [{
        type: String,
        required: [true, "Director name is required"],
        trim: true
    }],

    cast: [{
        type: String,
        required : true
    }],

    certificate: {
        type: String,
        enum: ["U", "U/A", "A"],
        default: "U"
    },

    averageRating: {
        type: Number,
        min: 0,
        max: 10,
        default: 0
    },

    totalRatings: {
        type: Number,
        default: 0
    },

    releaseDate: {
        type: Date,
        required: [true, "Release date is required"]
    },

    isActive: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true
});

const movieModel = mongoose.model("movie", movieSchema);

module.exports = movieModel;