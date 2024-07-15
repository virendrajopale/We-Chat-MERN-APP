import { Box, Container } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../Context/Chatprovider'
import SideBar from '../Components/Other/SideBar'
import MyChats from '../Components/MyChats'
import ChatBox from '../Components/ChatBox'

export const Chats = () => {
  const {user}=ChatState()
  const [fetchAgain, setfetchAgain] = useState(false);
  // console.log(user);
  return (
    <div style={{width:"100%"}}>
   {user && <SideBar/>}
      <Box
      display={"flex"}
      justifyContent={"space-between"} w={"100%"}
      h={'91.5vh'} p={'10px'}      >
        {user && <MyChats fetchAgain={fetchAgain}/>}
        {user && <ChatBox fetchAgain={fetchAgain} setfetchAgain={setfetchAgain}/>}
      </Box>
    </div>
  )
}

