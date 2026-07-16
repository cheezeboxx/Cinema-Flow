const express = require('express')
const multer = require('multer')


const authMiddleware = require('../middleware/auth.middleware')
const movieController = require('../controllers/movie.controller')
const { authorize } = require('../middleware/authorise.middleware')

const router = express.Router();


const upload = multer({ 
    storage : multer.memoryStorage() 
})


/**
 * - GET /api/movie/
 * - get all the movies 
 * - ( by User )
 */

router.get('/', movieController.getAllMovies)


/**
 * - GET /api/movie/:id
 * - get movie by id
 */

router.get('/:movieId', movieController.getMoviesById)


/**
 * - POST /api/movie/uplpoad-movie
 * - upload the movie 
 * - (by Admin)
 */
router.post(
    "/upload-movie",
    authMiddleware.authMiddleware, 
    authorize('admin'),
    upload.fields([
        { name : "poster" , maxCount : 1},
        { name : "trailer" , maxCount : 1}
    ]), 
    movieController.uploadMovie
)


/**
 * - POST /api/movie/create-screen
 * - create new screens for theatre 
 * - ( ANY - by Admin ) 
 * - ( OWN - by theatre_manager )
 */

router.post(
    '/theatre/:theatreId/screens',
    authMiddleware.authMiddleware,
    authorize('admin', 'theatre_manager'),
    movieController.createScreens
)




/**
 * - POST api/movie/update/:movieId
 * - update a movie 
 * - (by Admin)
 */
router.patch(
    '/update/:movieId',
    authMiddleware.authMiddleware,
    authorize('admin'),
    movieController.updateMovie
)


/**
 * - POST /api/movie/theatre
 * - can upload new theatres 
 * - ( by Admin )
 */

router.post(
    "/theatre",
    authMiddleware.authMiddleware,
    authorize('admin'),
    movieController.uploadTheatre
)


/**
 * - PATCH api/movie/promote/:userId
 * - promote a user to a theatre manager and assign him a theatre 
 * - ( by Admin )
 */

router.patch(
    '/promote/:userId',
    authMiddleware.authMiddleware,
    authorize('admin'),
    movieController.promoteUserToManager
)



/**
 * - POST /api/movie/delete-movie
 * - delete a movie 
 * - (by Admin)
 */
router.delete(
    "/delete-movie/:movieID",
    authMiddleware.authMiddleware,
    authorize('admin'),
    movieController.deleteMovie
)






module.exports = router;