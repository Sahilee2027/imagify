import mongoose from "mongoose"

//so in this we have to 1st define the struture of our data
const transactionSchema=new mongoose.Schema({
    userId :{type:String ,required:true},
    plan:{type:String ,required:true},
    amount:{type:Number,required:true},
    credits:{type:Number,required:true},
    payment:{type:Boolean,default:false},
    date:{type:Number}, 
})

const transactionModel = mongoose.models.transaction || mongoose.model("transaction", transactionSchema);

//it will check pehele ki model.user available hai kya if it is available then used that user  reuse
//but if it not available then new banaenga  if not then it creates the new model

export default transactionModel;

