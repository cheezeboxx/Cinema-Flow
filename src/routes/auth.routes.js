const express = require('express')
const userController = require('../controllers/auth.controller')

const router = express.Router()

router.post("/register", userController.registerUserController)
router.post("/login", userController.loginUserController)


module.exports = router