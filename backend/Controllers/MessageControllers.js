const expressAsyncHandler = require("express-async-handler");
const Message = require("../Models/MessageModel");
const { populate } = require("../Models/ChatModel");
const Chat = require("../Models/ChatModel");
const User = require("../Models/UserModel");

exports.sendMesage=expressAsyncHandler(async(req,res)=>{
    const {content,chatId}=req.body
    if(!content || !chatId){
        return res.status(402).json({msg:"Invalid Data"})
    }
    let newMessage={
        sender:req.user._id,
        content:content,
        chat:chatId
    }
    try {
        let message=await Message.create(newMessage)
        message=await message.populate('sender','name avatar')
        message=await message.populate('chat')
        message=await User.populate(message,{
            path:'chat.users',
            select:'name avatar email'
        })
        await Chat.findByIdAndUpdate(chatId,{
            latestMessage:message
        })
        res.json(message)

    } catch (error) {
        res.status(400);
        throw new Error("Error in message creation")
    }
})

exports.allMessages=expressAsyncHandler(async(req,res)=>{
    try {
        const messages=await Message.find({chat:req.params.chatId})
        .populate('sender','name avatar email')
        .populate('chat')
        res.json(messages)
        } catch (error) {
            res.status(400);
            throw new Error("Error in message fetch")
    }
})