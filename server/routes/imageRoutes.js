import express from 'express'
import { generateImage } from '../controllers/imagecontroller.js'
import userAuth from '../middlewares/auth.js'

const imageRouter=express.Router()

imageRouter.post('/generate-image',userAuth,generateImage) //userAuth middleware that will add userID in the body


export default imageRouter