const express = require('express')
const showController = require('../controllers/shows.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/authorise.middleware');
const router = express.Router();


/**
 * - POST /api/showtime/
 * - create a showtime 
 * - Admin and Theatre manager
 */
router.post(
    "/",
    authMiddleware.authMiddleware,
    authorize('admin', 'theatre_manager'),
    showController.createShowTime
)

/**
 * - GET /api/showtime/
 * - get all the showtimes availaible
 * - public 
 */
router.get(
    "/",
    showController.getAllShowTimes
)

module.exports = router;