import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../../Config/ChatLogic'
import { ChatState } from '../../Context/Chatprovider'
import { Avatar, Tooltip } from '@chakra-ui/react'
const ScrollableChat = ({messages}) => {
    const {user}=ChatState()
  return (
    <ScrollableFeed>
    {
        messages && messages.map((msg,i)=>{
            return <div key={i} className=' flex'>
                {
                    (isSameSender(messages,msg,i,user._id)
                    ||
                    isLastMessage(messages,i,user._id)) &&
                    (
                        <Tooltip label={msg.sender.name}
                            placement='bottom-start'
                            hasArrow>
                            <Avatar 
                                mt={'7px'}
                                mr={1}
                                size={'sm'}
                                cursor={'pointer'}
                                src={msg.sender.avatar}
                                name={msg.sender.name}

                            />
                        </Tooltip>
                    )
                }
                <span className={`${msg.sender._id==user._id?'bg-[#1C63D5] text-white rounded-t-lg rounded-br-none':"bg-white rounded-tr-lg"} rounded-b-lg  p-[5px_15px]  max-w-[75%]`}
                style={{marginLeft:isSameSenderMargin(messages,msg,i,user._id),
                marginTop:isSameUser(messages,msg,i)?3:10}}>
                    {msg.content}
                </span>
            </div>
        })
    }
    </ScrollableFeed>
  )
}

export default ScrollableChat