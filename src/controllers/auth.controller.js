const userModel = require('../models/user.model')
const emailService = require('../services/email.service')
const jwt = require('jsonwebtoken')

async function registerUserController(req, res) {

    try {

        const {email, username, password} = req.body;

        const isUserAlreadyExist = await userModel.findOne({
            $or : [
                {email}, 
                {username}
            ]
        })

        if(isUserAlreadyExist) {
            return res.status(409).json({
                message : "User already exist with the given data"
            })
        }

        const user = await userModel.create({
            email, username, password
        })

        const token = jwt.sign({
            userId : user._id,
            role : user.role,
            managedTheatre : user.managedTheatre
        }, 
        process.env.JWT_KEY, 
        {expiresIn : '3d'} )

        res.cookie("token", token)

        const userObj = user.toObject();
        delete userObj.password;

        res.status(201).json({
            message : "User created successfully",
            user : userObj
        })

        await emailService.registrationEmail(user.email, user.username);

    } catch(err) {
        console.log(err)
        return res.status(500).json({
            message : "Something went wrong in registeration"
        })
    }

}

async function loginUserController(req, res) {


    try {
        const { email, username, password } = req.body;

        const user = await userModel.findOne({ 
            $or : [
                {email},
                {username}
            ]
        }).select('+role +password')

        if(!user) {
            return res.status(404).json({
                message : "User Not Found"
            })
        }

        const isPassword = await user.compare(password)

        if(!isPassword) {
            return res.status(401).json({
                message : "Password is Incorrect"
            })
        }

        const token = await jwt.sign({
            userId : user._id, 
            role : user.role,
            managedTheatre : user.managedTheatre
        }, process.env.JWT_KEY, {
            expiresIn : '3d'
        })

        res.cookie("token", token)

        const userObj = user.toObject();
        delete userObj.password;

        res.status(200).json({
            message : "User logged in successfully",
            user : userObj
        })

        await emailService.loginEmail(user.email, user.username)
    } catch (err) { 
        return res.status(500).json({ message : "Something went wrong during login" })
    }

}


module.exports = {
    registerUserController,
    loginUserController
}