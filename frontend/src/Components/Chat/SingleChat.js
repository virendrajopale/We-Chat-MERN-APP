import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/Chatprovider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { FaArrowLeft } from 'react-icons/fa'
import { getSender, getSenderDetails } from '../../Config/ChatLogic'
import Profile from '../Profile/Profile'
import UpdateGroupModal from '../Other/UpdateGroupModal'
import ScrollableChat from './ScrollableChat'
import axios from 'axios'
import io from 'socket.io-client'
import Lottei from 'react-lottie'
import animationData from '../../Animations/typingAnim.json'
const ENDPOINT='http://localhost:5001'
var socket,selectedChatCompare
const SingleChat = ({fetchAgain,setfetchAgain}) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState();
    const [socketconnected, setSocketconnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const {user,selectedChat,setSelectedChat,notification, setNotification}=ChatState()
    
const toast=useToast()
   
    const getAllMessages=async()=>{
        if(!selectedChat){
            return
        }
        try {
            setLoading(true)
            const config={
                headers:{
                   
                    Authorization:`Bearer ${user.token}`
                }
            }
            const {data}=await axios.get(`/api/message/${selectedChat._id}`,config)
            setMessages(data)
           
            setLoading(false)
            socket.emit("join chat",selectedChat._id)
        } catch (error) {
            toast({
                title:"Error Occured",
                status:"error",
                duration:5000,
                isClosable:true,
                position:"top-left"
              }) 
        }
    }
    const sendMessage=async(event)=>{
        if(event.key==='Enter' && newMessage){
            socket.emit('stop typing',selectedChat._id)
            try {
                const config={
                    headers:{
                        'Content-Type':'application/json',
                        Authorization:`Bearer ${user.token}`
                    }
                }
                setNewMessage('')
                const {data}=await axios.post('/api/message',{content:newMessage,chatId:selectedChat._id},config)
                socket.emit('new message',data)
                setMessages([...messages,data])

            } catch (error) {
                toast({
                    title:"Error Occured",
                    status:"error",
                    duration:5000,
                    isClosable:true,
                    position:"top-left"
                  }) 
            }
        }
    }
    useEffect(() => {
        
        socket=io(ENDPOINT);
        socket.emit('setup',user)
        socket.on("connected",()=>setSocketconnected(true))
        socket.on("typing",()=>{
            
            setIsTyping(true)})
        socket.on("stop typing",()=>setIsTyping(false))
      }, []);
    useEffect(() => {
        getAllMessages()
        selectedChatCompare=selectedChat;
    }, [selectedChat]);
  
    useEffect(() => {
        
     socket.on("message recieved",(newMsgRecieved)=>{
       
        if(!selectedChatCompare || selectedChatCompare._id!==newMsgRecieved.chat._id){
            //notify
            if(!notification.includes(newMsgRecieved)){
                setNotification([newMsgRecieved,...notification])
                setfetchAgain(!fetchAgain)
            }
        }else{
            setMessages([...messages,newMsgRecieved])
        }

     })
    });
   
   
    const typingHandler=(e)=>{
        setNewMessage(e.target.value)
        if(!socketconnected) return;
  
        if(!typing){
            setTyping(true)
            socket.emit("typing",selectedChat._id);
            console.log(isTyping);
        }

        let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
    }
    const defaultOpt={
       loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
    }
  return (
    <>
        {selectedChat?(
            <>
                <Text fontSize={'2rem'}
                pb={3}
                px={2}
                w={'100%'}
                display={'flex'}
                justifyContent={{base:'space-between'}}
                alignItems={'center'}>
                <IconButton display={{base:'flex',md:'none'}}
                    icon={<FaArrowLeft/>}
                    onClick={()=>{
                        setSelectedChat("")
                    }}
                />
               
                {!selectedChat.groupChat?(
                    <>
                        {getSender(user,selectedChat.users)}
                        {<Profile user={getSenderDetails(user,selectedChat.users)}/>}
                    </>
                ):(
                    <> {selectedChat.chatName.toUpperCase()}
                    {<UpdateGroupModal fetchAgain={fetchAgain} setfetchAgain={setfetchAgain} getAllMessages={getAllMessages}/>}
                    </>
                )}
                </Text>
                <Box display={'flex'}
                flexDir={'column'}
                justifyContent={'end'}
                p={3}
              border='1px' borderColor='gray.200'
                w={'100%'}
                h={'100%'}
                borderRadius={'lg'}
                overflowY={'hidden'}>
                    {
                        loading?(<Spinner size={'xl'}
                            w={20} h={20} alignSelf={'center'}
                            margin={'auto'}
                        />):(
                            <div className=' flex flex-col overflow-y-scroll'>
                                <ScrollableChat messages={messages}/>
                            </div>
                        )
                    }
                    <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                    {isTyping ?<div>
                    <Lottei 
                        width={70}
                        style={{marginLeft:0,marginBottom:15}}
                        options={defaultOpt}
                    />
                    </div>:<></>}
                        <Input variant={'solid'} bg={'#E0E0E0'}
                            placeholder='Enter a message'
                            onChange={typingHandler}
                            value={newMessage}
                        />
                    </FormControl>
                </Box>
            </>
        ):(
            <Box
      display={'flex'}
      alignItems={'center'}
        justifyContent={'center'}
        h={'100%'}
      >
      <Text fontSize={'3xl'} pb={3}>
            Click on User to Start Chatting
      </Text>
      </Box>
        )}
    </>
  )
}

export default SingleChat