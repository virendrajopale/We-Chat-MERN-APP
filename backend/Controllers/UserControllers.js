const expressAsyncHandler = require("express-async-handler");
const User = require("../Models/UserModel");
const { generateToken } = require("../Config/generateToken");

exports.registerUser=expressAsyncHandler(async(req,res)=>{
    try {
        
    
    const {name,email,password,avatar}=req.body
    if(!name || !email || !password){
        res.status(400).json({
            msg:"Invalid Credentials"
        })
        throw new Error("Please Enter Details")
    }
    const userExist=await User.findOne({email});
    if(userExist){
        res.status(400).json({
            msg:"User Credentials Already"
        })
        throw new Error("User Credentials Already")
    }
    const newUser=await User.create({name,email,password,avatar});
    if(newUser){
        res.status(200).json({
           _id:newUser._id,
           name:newUser.name,
           email:newUser.email,
           avatar:newUser.avatar,
           token:generateToken(newUser._id)
        })
    }
    else{
        res.status(400)
        throw new Error("Failed to create User")
    }
} catch (error) {
        console.log(error);
}
})

exports.loginUser=expressAsyncHandler(async(req,res)=>{
   
        const {email,password}=req.body
        const user=await User.findOne({email});
        if(!user){
            res.status(400)
            throw new Error("User Not Exist")
            
        }
        
        else if(user && (await  user.matchPassword(password))){
          
        
            res.status(200).json({
                _id:user._id,
                name:user.name,
                email:user.email,
                avatar:user.avatar,
                token:generateToken(user._id)
             })
        }else{
            res.status(400)
            throw new Error("User Invalid")
        }

    
})
exports.allUsers=expressAsyncHandler(async(req,res)=>{
    const searchQuery=req.query.search?{
        $or:[
            {name:{$regex:req.query.search,$options:"i"}},
            {email:{$regex:req.query.search,$options:"i"}},
        ]
    }:{}
   const users=await User.findOne(searchQuery).find({_id:{$ne:req.user._id}});
    res.send(users)
})