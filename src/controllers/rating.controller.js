const ratingModel = require('../models/rating.model')
const movieModel = require('../models/movie.model')


async function ratingMovieController(req, res) {

    try {

        const { movie, rating, review = "" } = req.body;
        const user = req.user.userId;

        const Movie = await movieModel.findOne({ _id : movie })

        if(!Movie) {
            return res.status(401).json({
                message : "Movie does not exist"
            })
        }


        const rate = await ratingModel.create({
            user, movie, rating, review
        })

        const avg = Movie.averageRating;
        const total = Movie.totalRatings;

        const nSum = (avg * total) + rating;
        const new_avg = nSum / (total + 1);

        await movieModel.updateOne(
            { _id : movie },
            { $set : { averageRating : new_avg, totalRatings : total + 1 }}
        )

        return res.status(201).json({
            message : "rating recorded successfully",
            rate
        })


    } catch (err) { 

        if(err.code === 11000) {
            return res.status(409).json({
                message : "You have already rated this movie"
            })
        }

        console.log(err);

        return res.status(500).json({
            message : "Internal service error"
        })

    }

}

module.exports = {
    ratingMovieController
}