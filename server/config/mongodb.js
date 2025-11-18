//here we will add the code to connect the project to our mongodb database
import mongoose from "mongoose";


const connectDB=async ()=>{

    mongoose.connection.on('connected',()=>{
        console.log("Database connected")
    })
    await mongoose.connect(`${process.env.MONGODB_URI}/imagify`) // here we hav ethe provide the connection string but we have alredy provided to the env variable
}

export default connectDB;  //we have to export this so that we can used this in other file by the fun name 