function authorize(...allowedRoles) {
    return function(req, res, next) {
        if(!req.user || !req.user.role) {
            
            return res.status(401).json({
                message : "Not Authorized"
            })
        }

        if(!allowedRoles.includes(req.user.role)) {
            console.log(req.user.role)
            return res.status(403).json({
                message : "Access denied. You do not have permission to perform this action"
            })
        }

        return next();
    }
}

module.exports = { authorize }