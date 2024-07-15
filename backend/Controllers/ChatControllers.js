const expressAsyncHandler = require("express-async-handler");
const Chat = require("../Models/ChatModel");
const User = require("../Models/UserModel");

exports.accessChats=expressAsyncHandler(async(req,res)=>{
    const {userId}=req.body;

    if(!userId){
        res.status(401);
        throw new Error("User Id is undefinded")
    }
    let isChat=await Chat.find({
        groupChat:false,
        $and:[
            {users:{$elemMatch:{$eq:req.user._id}}},
            {users:{$elemMatch:{$eq:userId}}},
        ]
    }).populate('users','-password').populate('latestMessage');

    isChat=await User.populate(isChat,{
        path:"latestMessage.sender",
        select:"name avatar email"
    })
  
    if(isChat.length>0){
        res.send(isChat[0])
    }else{
        var chatData={
            chatName:"sender",
            groupChat:false,
            users:[req.user._id,userId]
        }
        try {
            const newChat=await Chat.create(chatData);

            const fullChat=await Chat.findOne({_id:newChat._id}).populate('users','-password')
            res.status(300).json(fullChat)
        } catch (error) {
            res.status(400);
            throw new Error("Chat Error")
        }
    }
})

exports.fetchChats=expressAsyncHandler(async(req,res)=>{
    try {
 
    //   const chats=await 
       Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
        .populate('users','-password')
        .populate('groupAdmin','-password')
        .populate('latestMessage')
        .sort({updatedAt:-1})
        .then(async(result)=>{

            result=await User.populate(result,{
                path:"latestMessage.sender",
                select:"name avatar email"
            })
            res.status(201).send(result)
        })

    } catch (error) {
        res.status(400);
            throw new Error("Chat Error")
    }
})
exports.createGroup=expressAsyncHandler(async(req,res)=>{

   if(!req.body.users || !req.body.name){
    return res.status(300).send({message:"Fill All the data"})
   }
   var users=JSON.parse(req.body.users);
   if(users.length<2){
    return res.status(400).send("More than 2 users required")
   }
   users.push(req.user)//curr user

   try {
      const group=await Chat.create({
        chatName:req.body.name,
        groupChat:true,
        users:users,
        groupAdmin:req.user
      })
   
      const fullGroupChat=await Chat.findOne({_id:group._id })
      .populate('users','-password')
      .populate('groupAdmin','-password')
      res.status(200).json(fullGroupChat)
   } catch (error) {
    res.status(400);
    throw new Error("Chat Error")
   }
})
exports.renameGroup=expressAsyncHandler(async(req,res)=>{
    const {chatId,chatName}=req.body;

    const updateName=await Chat.findByIdAndUpdate(chatId,{
        chatName
    },{
        new:true
    })
    .populate('users','-password')
      .populate('groupAdmin','-password')
      if(!updateName){
        res.status(400).send("Error in renaming")

      }else{
        res.status(200).send(updateName)
      }
})

exports.addToGroup=expressAsyncHandler(async(req,res)=>{
    const {chatId,userId}=req.body;
    const added=await Chat.findByIdAndUpdate(chatId,{
        $push:{users:userId},
    } ,{new:true},)
    if(!added){
        res.status(400).send("Error in adding")
    }else{
        res.status(200).send(added)
    }
})


exports.removeFromGroup=expressAsyncHandler(async(req,res)=>{
    const {chatId,userId}=req.body;
    const removed=await Chat.findByIdAndUpdate(chatId,{
        $pull:{users:userId},
    } ,{new:true},)
    if(!removed){
        res.status(400).send("Error in adding")
    }else{
        res.status(200).send(removed)
    }
})
