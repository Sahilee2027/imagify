import mongoose from "mongoose"

//so in this we have to 1st define the struture of our data
const userSchema=new mongoose.Schema({
      name:{type:String,required:true}, //this data should be stored in the database so we add required :true
      email:{type:String,required:true,unique:true}, //so we cannot store the data we the same email id
      password:{type:String ,required:true},
      creditBalance:{type:Number,default:50},

})
//userSchema will define how a user document will look inside your mongoDb collection

const userModel=mongoose.models.user||mongoose.model("user",userSchema)
//it will check pehele ki model.user available hai kya if it is available then used that user  reuse
//but if it not available then new banaenga  if not then it creates the new model

export default userModel;

//moongoose.model() creates a model (like a class) for a collection
//it binds your schema to a mongodb collection //once created you can perform crud operation using the model

//mongoose.models is an object containing all already registered models 
//mongoose.model("user",userSchema) creates the new model if it doesnot exist