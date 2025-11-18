import jwt from 'jsonwebtoken'


//this middleware will be excuted before the controller fun
//whenever the success get true we will execute the next method
// we have created the userAuth middleware 
//that will find the userid from the token and add that userid in the req body
const userAuth=async(req,res,next) =>{
    const {token}=req.headers;

    if(!token){
        return res.json({success:false ,message:'Not Authorized Login Again'});
    }

    try{
        const tokenDecode=jwt.verify(token,process.env.JWT_SECRET) //so we can verify the token using jwt secret

        if(tokenDecode.id){
            //if(!req.body) req.body={};  //ensure req.body exists
           req.body.userId=tokenDecode.id; //here you are adding userId from the frontend to the backend
        } else{
            return res.json({success:false,message:'Not Authorized . Login Again'});
        }
        next(); //call the next fun

    }catch(error){
        return res.json({success:false,message:error.message});

    }
}

export default userAuth;