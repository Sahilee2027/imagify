import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import razorpay from 'razorpay'
import transactionModel from "../models/transactionModel.js";

//controller function register user 
const registerUser=async(req,res)=>{
       try{
        const {name,email,password}=req.body; //contain the data sent from the frontend signup form
        if(!name||!email||!password){
            return res.json({success:false,message:'Missing Details'})
        }
        const salt=await bcrypt.genSalt(10) //it will provide moderate encryption
        const hashedPassword=await bcrypt.hash(password,salt)

        const userData={
            name,
            email,
            password:hashedPassword     //encrypted pass
        }
        

        //using the userData we have created the new user in the database
        const newUser=new userModel(userData) //by default credit will be available to the usermodel
        const user=await newUser.save() //it will save the new user in the database 
        
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET) 
        //so here token is made using user_id and jwt secret which is written in env variable
        res.json({success:true ,token,user:{name:user.name}})

       }catch (error){  //if any err occur in the try box then catch box will execute
          console.log(error)
          res.json({success:false ,message:error.message})
       }
}

const loginUser=async (req,res)=>{
    try{
        const {email,password}=req.body;
        const user =await userModel.findOne({email}) //to find the user we are using the userModel as email is unique
        
        if(!user){
            return res.json({success:false ,message:'user does not exist'})
        }

        const isMatch=await bcrypt.compare(password,user.password) //for the user we will compare the password with the user.password which is saved in the db
        if(isMatch){
            const token=jwt.sign({id:user._id},process.env.JWT_SECRET)

            res.json({success:true,token,user:{name:user.name}})
         }
          else{
            return res.json({success:false ,message:'Invalid credentials'})

            }
        
    }catch(error){
        res.json({success:false,message:error.message})

    }
}

const userCredits=async (req,res)=>{
    try{
        const{userId}=req.body;

        if(!userId){               //
           return res.json({success:false,message:"User ID missing in request"})
        }

        const user=await userModel.findById(userId)
        if(!user){                  //
            return res.json({success:false ,message:"User not Found"});
        }
        res.json({success:true ,credits:user.creditBalance,user:{name:user.name}})
    }catch(error){
        console.log(error.message)
        res.json({success:false,message:error.message})

    }
}

const razorpayInstance=new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET,
});

const paymentRazorpay=async(req,res)=>{
    try{
      const{userId,planId}=req.body
      const userData=await userModel.findById(userId)

      if(!userId || !planId){
        return res.json({success:false,message:'Missing Details'})
      }
      let credits,plan,amount,date 
      switch (planId){

        case 'Basic':
            plan='Basic'
            credits=100
            amount=10
            break;

        case 'Advanced':
            plan='Advanced'
            credits=500
            amount=50
            break;
        case 'Business':
            plan='Business'
            credits=5000
            amount=250
            break;

            default:
                return res.json({
                    success:false,message:'Plan not found '
                });
      }
      
      date=Date.now() ;
                       //it will provide the current time stamp 
      const transactionData={     //we have to store this transaction data to mongodb database 
        userId,plan,amount,credits,date
      }
      const newTransaction=await transactionModel.create(transactionData)
      const options={
        amount:amount*100,
        currency:process.env.CURRENCY,
        receipt:newTransaction._id,

      }

      await razorpayInstance.orders.create(options,(error,order)=>{
           if(error){
            console.log(error);
            return res.json({success:false,message:error})
           }
           res.json({success:true,order})
      })
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}




export {registerUser,loginUser,userCredits,paymentRazorpay}

