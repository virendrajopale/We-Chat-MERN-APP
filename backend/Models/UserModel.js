
const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')

const UserModel=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        required:true,
        default:"https://t4.ftcdn.net/jpg/07/95/95/13/360_F_795951374_QR1tADRPLjbh0NqrJqLPbzOTHJW5HjmY.jpg"
    },
    

},{
    timestamps:true
})

UserModel.methods.matchPassword=async function(pass){
    console.log("hii");
    return await bcrypt.compare(pass,this.password)
}

UserModel.pre('save',async function (next){
    if(!this.isModified){
        next();
    }
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt)
})
const User=new mongoose.model('User',UserModel)
module.exports=User