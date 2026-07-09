const express = require('express')
const reservationController = require('../controllers/reservation.controller')
const authMiddleware = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/authorise.middleware')
const router = express.Router();



/**
 * - GET /api/booking/showtime/:showTimeId/seats
 * - to get the availaible seats for the showTime 
 * - ( no need for authentication ) 
 */

router.get(
    "/showtime/:showTimeId/seats",
    reservationController.getAvailaibleSeats
)


/**
 * - POST /api/booking/showtime/:showTimeId/book
 * - book seats for the movie
 */
router.post(
    "/showtime/:showTimeId/book",
    authMiddleware.authMiddleware,
    authorize('user', 'admin'),
    reservationController.createReservation
)


/**
 * - PATCH /api/booking/cancel/:reservationId
 * - cancel the booking
 * - user and admin
 */
router.patch(
    "/cancel/:reservationId",
    authMiddleware.authMiddleware,
    authorize('user', 'admin'),
    reservationController.cancelReservation
)   


module.exports = router;