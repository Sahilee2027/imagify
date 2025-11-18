//apis //here we need the controllers function

import express from 'express'
import {registerUser,loginUser, userCredits, paymentRazorpay} from '../controllers/userController.js'
import userAuth from '../middlewares/auth.js';

const userRouter=express.Router()

userRouter.post("/register",registerUser); //now we have to test this apis
userRouter.post("/login",loginUser);
userRouter.get('/credits',userAuth,userCredits) //but to the userCredits we need the userid for that we have to used the middleware
userRouter.post('/pay-razor',userAuth,paymentRazorpay)

export default userRouter;