const jwt = require('jsonwebtoken')

async function authMiddleware(req, res, next) {

    const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ]
    
    if(!token) {
        return res.status(401).json({
            message: "Authorization token are required"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY)

        req.user = decoded

        return next();

    } catch(err) {

        if(err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token."
            });
        } 

        return res.status(500).json({
            message : "Internal Server Error"
        })
    }

}

module.exports = {
    authMiddleware
}