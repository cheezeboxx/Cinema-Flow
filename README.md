# CinemaFlow 🎬

A full-stack movie ticket reservation backend built with Node.js, Express, and MongoDB — featuring JWT authentication, role-based access control (RBAC), and concurrency-safe seat booking.

## Features

- **Authentication** — JWT-based auth with secure password hashing (bcrypt), cookie/header token support
- **Role-Based Access Control** — three roles (`user`, `admin`, `theatre_manager`) with a reusable, scalable authorization middleware
- **Theatre Management** — admins can onboard theatres and promote users to theatre managers, scoping their permissions to a single theatre
- **Screen Management** — screens tied to theatres, with ownership checks so managers can only modify their own theatre's screens
- **Movie Catalog** — upload movies with poster/trailer files (via ImageKit), browse, and manage listings
- **Showtime Scheduling** — create showtimes with automatic overlap detection to prevent double-booking a screen
- **Atomic Seat Reservation** — race-condition-safe seat booking using MongoDB's atomic `findOneAndUpdate`, preventing two users from booking the same seat simultaneously
- **Reservation Management** — book seats, view availability, and cancel bookings (with a 2-hour pre-showtime cutoff)
- **Ratings & Reviews** — users can rate and review movies, with automatic average rating recalculation

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT), bcryptjs
- **File Uploads:** Multer (memory storage) + ImageKit
- **Email:** Custom email service for registration/login notifications

## Architecture Highlights

### Role-Based Access Control
A single, reusable `authorize(...roles)` middleware checks the requester's role (attached via JWT payload during login) against an allow-list per route — avoiding duplicated per-role middleware files.

```js
router.post('/theatre/:theatreId/screens', authMiddleware, authorize('admin', 'theatre_manager'), screenController.createScreen)
```

Theatre managers are further scoped to their own theatre via a `managedTheatre` field checked inside each controller.

### Concurrency-Safe Seat Booking
Seat booking uses a single atomic MongoDB operation to check seat availability and reserve seats in one step, eliminating race conditions where two users could book the same seat simultaneously:

```js
const updatedShowtime = await showtimeModel.findOneAndUpdate(
    { _id: showtimeId, "bookedSeats.seatNumber": { $nin: requestedSeats } },
    { $push: { bookedSeats: { $each: newBookings } } },
    { returnDocument: "after" }
)
```

If any requested seat was already taken, the operation returns `null`, and the API responds with a `409 Conflict` — no partial or duplicate bookings possible.

## Project Structure

```
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── auth.controller.js
│   ├── movie.controller.js
│   ├── rating.controller.js
│   ├── reservation.controller.js
│   └── shows.controller.js
├── middleware/
│   ├── auth.middleware.js      # JWT verification
│   └── authorise.middleware.js # Role-based authorization
├── models/
│   ├── movie.model.js
│   ├── rating.model.js
│   ├── reservation.model.js
│   ├── screen.model.js
│   ├── showtime.model.js
│   ├── theatre.model.js
│   └── user.model.js
├── routes/
│   ├── auth.routes.js
│   ├── movie.routes.js
│   ├── rating.routes.js
│   ├── reservation.routes.js
│   └── shows.routes.js
├── services/
│   ├── email.service.js
│   └── storage.service.js
├── server.js
└── app.js
```

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB instance (local or Atlas)

### Installation

```bash
git clone https://github.com/cheezeboxx/CinemaFlow.git
cd CinemaFlow
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```
MONGODB_URI=your_mongodb_connection_string
JWT_KEY=your_jwt_secret_key
```

(Add any ImageKit/email service credentials your `storage.service.js` / `email.service.js` require.)

### Running the server

```bash
npm start
```

## API Overview

| Resource | Endpoint | Access |
|---|---|---|
| Auth | `POST /api/auth/register` | Public |
| Auth | `POST /api/auth/login` | Public |
| Movies | `GET /api/movie` | Public |
| Movies | `POST /api/movie/upload-movie` | Admin |
| Theatres | `POST /api/movie/theatre` | Admin |
| Screens | `POST /api/movie/theatre/:theatreId/screens` | Admin, Theatre Manager |
| Showtimes | `POST /api/showtime` | Admin, Theatre Manager |
| Showtimes | `GET /api/showtime` | Public |
| Seats | `GET /api/booking/showtime/:showTimeId/seats` | Public |
| Reservations | `POST /api/booking/showtime/:showTimeId/book` | User, Admin |
| Reservations | `PATCH /api/booking/cancel/:reservationId` | User, Admin |
| Ratings | `POST /api/rating` | User, Admin |

## Roadmap

- [ ] User reservation history endpoint
- [ ] Theatre-scoped reservation visibility for managers
- [ ] MongoDB transactions for booking flow
- [ ] Showtime update/cancellation with cascading reservation handling
- [ ] Admin user management dashboard

## Author

Built by [Akshaj](https://github.com/cheezeboxx) as a backend systems project.
