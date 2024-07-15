const dotenv = require("dotenv");
const express = require("express");
const chats = require("./data");
const { DatabaseConnection } = require("./Config/database");
const userRouter = require("./Routes/UserRoutes");
const { notFound, errorHandler } = require("./Middleware/ErrorWare");
const chatRouter = require("./Routes/ChatRoutes");
const messageRouter = require("./Routes/messageRouter");
const path=require('path')
const app =express();
dotenv.config()
DatabaseConnection()

app.use(express.json())


app.use('/api/user',userRouter)
app.use('/api/chats',chatRouter)
app.use('/api/message',messageRouter)

const __dir=path.resolve()
if(process.env.NODE_ENV=='production'){
    app.use(express.static(path.join(__dir,"/frontend/build/")))
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dir,"frontend","build","index.html"))
    })
}else{
    app.get('/',(req,res)=>{
        res.send("API IS RUNNING")

    })

}
//error handles
app.use(notFound)
app.use(errorHandler)

const server=app.listen(process.env.PORT,_=>{
 console.log("Server is listernig on ",process.env.PORT);
})

const io=require('socket.io')(server,{
    pingTimeout:60000, // 60 seconds keep alive
    cors:{
        origin:"http://localhost:3000"
    }
})
io.on("connection",(socket)=>{
    console.log('Connected to socket.io');
    socket.on("setup",(userData)=>{
        socket.join(userData._id)
        socket.emit('connected')
    })
    socket.on("join chat",(room)=>{
        socket.join(room)
        console.log('User Joined room ',room);
    })
    socket.on("typing",(room)=>socket.in(room).emit("typing"))
    socket.on("stop typing",(room)=>socket.in(room).emit("stop typing"))
    socket.on('new message',newMsgRecieved=>{
        var chat=newMsgRecieved.chat;
        if(!chat.users){
            return console.log("Chat users not defined");
        }
        
        chat.users.forEach(user => {
            if(user._id==newMsgRecieved.sender._id){ //except himself
                return;
            }
           
            socket.in(user._id).emit("message recieved",newMsgRecieved)
        });
    })
    socket.off("setup",()=>{
        console.log("User DiSconnected Soccet is off");
        socket.leave(userData._id)
    })
})
