import React from 'react'
import {ChatState} from '../Context/Chatprovider'
import { Box } from '@chakra-ui/react'
import SingleChat from './Chat/SingleChat'
const ChatBox = ({fetchAgain, setfetchAgain}) => {
const {user,selectedChat}=ChatState()
  return (
    <>
      <Box
      display={{base:selectedChat?'flex':'none',md:'flex'}}
      alignItems={'center'}
      flexDir={'column'}
      p={3}
       background={"blackAlpha.300"}  backdropFilter='blur(10px)'
      w={{base:'100%',md:'68%'}}
      borderRadius={'lg'}
      borderWidth={'1px'}
      >
  <SingleChat fetchAgain={fetchAgain} setfetchAgain={setfetchAgain}/>
      </Box>
    </>
  )
}

export default ChatBox