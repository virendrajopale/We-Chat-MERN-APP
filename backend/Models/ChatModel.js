

const  mongoose  = require("mongoose");
const Schema=mongoose.Schema
const ChatModel=new mongoose.Schema({
    chatName:{
        type:String,
        trim:true
    },
    groupChat:{
        type:Boolean,
        default:false
    },
    users:[{
        type:Schema.Types.ObjectId,
        ref:"User"
    }],
    latestMessage:{
        type:Schema.Types.ObjectId,
        ref:"Message"
    },
    groupAdmin:{
         type:Schema.Types.ObjectId,
        ref:"User"
    },
},{
    timestamps:true
})
const Chat=mongoose.model('Chat',ChatModel)

module.exports=Chat