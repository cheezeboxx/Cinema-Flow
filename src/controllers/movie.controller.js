const movieModel = require('../models/movie.model')
const userModel = require('../models/user.model')
const theatreModel = require('../models/theatre.model')
const screenModel = require('../models/screen.model')
const imageKitService = require('../services/storage.service')

async function getAllMovies(req, res) {
    try {
        const movies = await movieModel.find({})

        res.status(200).json({
            message : "Movies fetched successfully",
            movies : movies
        })
    } catch (err) { 
        return res.status(500).json({
            message : "Internal server Error"
        })
    }
}

async function getMoviesById(req, res) {
    
    try {

        const { movieId } = req.params;

        const movie = await movieModel.findById(movieId) 

        if(!movie) {
            return res.status(404).json({
                message : "Movie does not exist"
            })
        }

        res.status(200).json({
            message : "Movie fetched successfully",
            movie : movie
        })

    } catch (err) { 
        console.log(err)
        return res.status(500).json({
            message : "Internal Server error"
        })

    }
}

async function uploadMovie(req, res) {
    
    try {

        let {
            title, description, duration, genre, language,
            director, cast, certificate, releaseDate
        } = req.body


        genre = JSON.parse(genre);
        language = JSON.parse(language);
        director = JSON.parse(director);
        cast = JSON.parse(cast);


        const isMovieExist = await movieModel.findOne({ title })


        if(isMovieExist) {
            return res.status(409).json({
                message : "Movie already exist"
            })
        }


        const posterFile = req.files.poster?.[0]


        if(!posterFile) {
            return res.status(400).json({
                message : "Poster is required"
            })
        }

        const trailerFile = req.files.trailer?.[0]

        if(!trailerFile) {
            return res.status(400).json({
                message : "Trailer is required"
            })
        }


        const posterUpload = await imageKitService.uploadFile(
            posterFile.buffer, 
            posterFile.originalname, 
            "/CINEMAFLOW/posters"
        )

        const trailerUpload = await imageKitService.uploadFile(
            trailerFile.buffer, 
            trailerFile.originalname, 
            "/CINEMAFLOW/trailers"
        )


        const movie = await movieModel.create({
            title, description, duration, genre, language, 
            poster : posterUpload.url,
            trailer : trailerUpload.url, 
            director, cast, certificate, releaseDate
        })


        return res.status(201).json({
            message : "Movie uploaded successfully",
            movie
        })


    } catch (err) { 
        console.log(err);
        return res.status(500).json({
            messsage : "Internal server Error"
        })
    }

}

async function deleteMovie(req, res) {
    try {
        const { movieId } = req.params;

        const isMovieExist = await movieModel.findByIdAndDelete({ movieId })

        if(!isMovieExist) {
            return res.status(404).json({
                message : "Movie already does not exist"
            })
        }

        return res.status(200).json({
            message : "Movie deleted successfully"
        })
    } catch (err) { 
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

async function promoteUserToManager(req, res) {

    const { userId } = req.params;
    const { theatreId } = req.body;

    const user = await userModel.findById(userId)

    if(!user) {
        return res.status(404).json({
            message : "User does not exist"
        })
    }

    const theatre = await theatreModel.findById(theatreId)

    if(!theatreId) {
        return res.status(404).json({
            message : "theatre does not exist"
        })
    }

    theatre.managedBy = user._id;
    await theatre.save();


    user.role = "theatre_manager";
    user.managedTheatre = theatreId;
    await user.save();

    res.status(200).json({
        message : "User promoted to Theatre Manager successfully",
        user : {
            id : user._id,
            username : user.username,
            role : user.role,
            managedTheatre : user.managedTheatre
        }
    })
}

async function uploadTheatre(req, res) {

    try {
        const { theatreName, location, city, state, isActive = true } = req.body;

        const isTheatreExist = await theatreModel.findOne({ 
            theatreName : theatreName,
            location : location 
        })

        if(isTheatreExist) {
            return res.status(409).json({
                message : "Theatre already exist"
            })
        }

        const theatre = await theatreModel.create({
            theatreName, location, city, state, isActive
        })

        res.status(201).json({
            message : "Theatre uploaded successfully",
            theatre : theatre
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }

}

async function createScreens(req, res) {

    try {
        
        const { screenName, capacity } = req.body;
        const { theatreId } = req.params;

        if(req.user.role === "theatre_manager" && req.user.managedTheatre !== theatreId) {
            return res.status(403).json({
                message : "You can only make changes in your own theatre"
            })
        }

        if(!theatreId) {
            const { theatreId, screenName, capacity } = req.body;
        }

        const theatre = await theatreModel.findById(theatreId);

        if(!theatre) {
            return res.status(409).json({
                message : "Theatre does not exist"
            })
        }

        const screen = await screenModel.create({
            theatre, screenName, capacity
        })
        
        return res.status(201).json({
            message : "Screen created",
            screen : screen
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message : "Internal Server error"
        })
    }
    
}

async function updateMovie(req, res) {

    try { 
        const { movieId } = req.params;

        const allowedFields = ['title', 'description', 'duration', 'genre', 'language', 'poster', 
            'trailer', 'cast', 'certificate', 'isActive'
        ];

        const updates = {};
        allowedFields.forEach(fields => {
            if(req.body[fields] !== undefined) updates[fields] = req.body[fields]
        });

        const movie = await movieModel.findByIdAndUpdate(movieId, updates, {
            new : true, 
            runValidators : true // enforce your schema validation on updates
        })

        if(!movie) {
            return res.status(404).json({ message : "Movie not found" })
        }

        return res.status(200).json({
            message : "Movie updated",
            movie
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message : "Internal server error"
        })
    }

}

module.exports = {
    uploadMovie,
    deleteMovie,
    getAllMovies,
    getMoviesById,
    promoteUserToManager,
    uploadTheatre,
    createScreens,
    updateMovie
}