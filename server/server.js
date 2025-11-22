import express from 'express'
import cors from 'cors'
import 'dotenv/config' 
import connectDB from './config/mongodb.js'
import userRouter from './routes/userRoutes.js'
import imageRouter from './routes/imageRoutes.js'



const PORT=process.env.PORT || 4000  //if the port no. is available in the env then it will used the port no. from the env otherwise it will used 4000
const app=express()
//after we have to add the cors in the express app 

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())
await connectDB() //when we call this function it will connect our express app to our mongodb database
//await shows wait until the mongodb connection is fully established 

app.use('/api/user',userRouter) 
app.use('/api/image',imageRouter)

app.get('/',(req,res)=>res.send("API Working "))

app.listen(PORT,()=>console.log('Server running on port'+ PORT));