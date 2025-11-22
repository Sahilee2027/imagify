import axios from "axios"
import userModel from "../models/userModel.js"
import FormData from "form-data"

export const generateImage=async(req,res)=>{
   try{

    console.log("Received userId:", req.body.userId, "Prompt:", req.body.prompt);

    //we write the logic to generate the image from prompt 
    const {userId,prompt}=req.body

    const user= await userModel.findById(userId)

    if(!user || !prompt){
        return res.json({ success:false ,message:'Missing Details'})
    }
    if(user.creditBalance===0 || user.creditBalance<0){
        return res.json({success:false ,message:'No Credit Balance',creditBalance:user.creditBalance})
    }

    const formData=new FormData() //creating the empty formData
    formData.append('prompt',prompt)  //we append the from data from append 

    //we have to send this form data to the apis 
    //here we made the api call
    const {data}=await axios.post('https://clipdrop-api.co/text-to-image/v1',formData,{
        headers: {
          'x-api-key': process.env.CLIPDROP_API,
  },
     responseType:'arraybuffer' //we get the response as arraybuffer and using that arraybuffer we have to convert the image
    })

    const base64Image=Buffer.from(data,'binary').toString('base64') //data this is the raw data you got from the axios with responseType:arraybuffer
    //using this base64image we have to generate the image url 
    const resultImage=`data:image/png;base64,${base64Image}` //tells the browser this is image of type png encoded in base64 ${base64image} the actual base64 string representing your image
    //so we already created the image so lets deduct the credit
    await userModel.findByIdAndUpdate(user._id,{creditBalance:user.creditBalance-10})
    //after that send the res 
    res.json({success:true,message:"Image Generated",creditBalance:user.creditBalance-10,resultImage})


   }catch(error){
    console.log(error.message)
    res.json({success:false,message:error.message})
   }
}