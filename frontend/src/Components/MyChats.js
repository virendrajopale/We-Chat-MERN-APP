import React, { useState,useEffect } from 'react'
import { ChatState } from '../Context/Chatprovider'
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { GrAddCircle } from 'react-icons/gr';
import {ChatLoading} from './Other/ChatLoading'
import { getSender } from '../Config/ChatLogic';
import GroupChatModal from './Other/GroupChatModal';
const MyChats = ({fetchAgain}) => {
    const [loggedUser, setloggedUser] = useState();
    const {user,chats,setChats,selectedChat,setSelectedChat}=ChatState()
    const toast=useToast()

    const fetchChats=async()=>{
        try {
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }
            const {data}=await axios.get(`/api/chats`,config)
            setChats(data);
        } catch (error) {
            toast({
                title:"Error Occured",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"bottom-left"
              }) 
        }
    }
    useEffect(() => {
        
setloggedUser(user)
fetchChats()
    }, []);
  return (
   <Box
   display={{base:selectedChat?'none':'flex',md:'flex'}}
   flexDir={'column'} alignItems={'center'} p={3}
     background={"blackAlpha.300"}  backdropFilter='blur(10px)' w={{base:'100%',md:'31%'}} borderRadius={'lg'} borderWidth="1px">
     <Box
     pb={3}
     px={2}
     fontSize={{base:'28px',md:'30px'}}
     
     display={'flex'}
     w={'100%'}
     justifyContent={'space-between'}
     alignItems={'center'}
     >
    My Chats
    <GroupChatModal >

    <Button
    display={'flex'}
    colorScheme='blue' variant='outline'
    fontSize={{base:'17px',md:'10px',lg:'18px'}}
    rightIcon={<GrAddCircle/>}>
    Create Group
    </Button>
    </GroupChatModal>

     </Box>
     <Box
     display={'flex'}
     flexDir={'column'}
     p={3}
      background={"blackAlpha.300"}  backdropFilter='blur(10px)'
     w={'100%'} h={'100%'} borderRadius={'lg'} overflowY={'hidden'}>
        {
           !chats?<ChatLoading/>:(
            <Stack overflowY={'scroll'}>
            {chats?.map(chat=>{
                return <Box
                onClick={()=>setSelectedChat(chat)}
                cursor={'pointer'}
                bg={selectedChat===chat?"#219C90":'#E8E8E8'}
              
                color={selectedChat===chat?'white':'black'}
                px={3}
                py={2}
                borderRadius={'lg'}
                borderWidth={'lg'}
                key={chat._id}
                >
                <Text >{!chat.groupChat?(getSender(loggedUser,chat.users)):chat.chatName}</Text>
                </Box>
            })}
            </Stack>
           )
        }
     </Box>
   </Box>
  )
}

export default MyChats