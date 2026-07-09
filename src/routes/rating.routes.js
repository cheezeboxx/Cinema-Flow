const express = require('express')
const router = express.Router()

const authMiddleware = require('../middleware/auth.middleware')
const ratingController = require('../controllers/rating.controller')
const { authorize } = require('../middleware/authorise.middleware')


router.post(
    "/",
    authMiddleware.authMiddleware,
    authorize('user', 'admin'),
    ratingController.ratingMovieController
)


module.exports = router;