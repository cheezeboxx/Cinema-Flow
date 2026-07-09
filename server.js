require('dotenv').config()
const app = require('./src/app')
const connectDB = require('./src/config/db')
const dns = require('dns')

dns.setServers(["1.1.1.1", "8.8.8.8"])


connectDB()




app.listen(3000, () => {
    try {
        console.log("Server is running in port 3000")
    } catch (err) {
        console.log("Error in running the server")
        process.exit(1)
    }
})