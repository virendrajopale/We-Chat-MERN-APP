const express=require('express');
const { registerUser, loginUser, allUsers } = require('../Controllers/UserControllers');
const { protect } = require('../Middleware/AuthWare');

const userRouter=express.Router();

userRouter.post('/register',registerUser)
userRouter.route('/').post(loginUser).get(protect, allUsers)

module.exports=userRouter