
const mongoose=require('mongoose')
const Schema=mongoose.Schema
const MessageModel=new mongoose.Schema({
    sender:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    content:{
        type:String,
        trim:true
    },
    chat:{
        type:Schema.Types.ObjectId,
        ref:"Chat"
    },

},{
    timestamps:true
})
const Message=new mongoose.model('Message',MessageModel)
module.exports=Message