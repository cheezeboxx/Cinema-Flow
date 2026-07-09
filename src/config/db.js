const mongoose = require('mongoose')


async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected to database")
    } catch (err) {
        console.log(err)
        console.log("Error in connecting to the database")
        process.exit(1)
    }
}

module.exports = connectDB