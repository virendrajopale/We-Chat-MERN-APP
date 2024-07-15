import { Avatar, Box, Button, Drawer, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Toast, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import { FaChevronCircleDown, FaRegBell, FaSearch } from "react-icons/fa";
import { ChatState } from '../../Context/Chatprovider';
import Profile from '../Profile/Profile';
import { useNavigate } from 'react-router-dom';
import {
  
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
  } from '@chakra-ui/react'
import axios from 'axios';
import {ChatLoading} from './ChatLoading';
import UserListItem from '../Profile/UserListItem';
import { getSender } from '../../Config/ChatLogic';
import NotificationBadge from "@parthamk/notification-badge";
import { Effect } from "@parthamk/notification-badge";
const SideBar = () => {
    const [search, setSearch] = useState();
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    const {user,setSelectedChat,chats,setChats,notification, setNotification}=ChatState();
    const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()
  const toast=useToast()
const navigate=useNavigate()
    const handleLogOut=()=>{
        localStorage.removeItem('userInfo');
        navigate('/')
    }


    const handleSearch=async()=>{
        if(!search){
            toast({
                title:"Please Search Something",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"top-left"
              })
              return
        }
        try {
            setLoading(true);
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }
            const {data}=await axios.get(`/api/user?search=${search}`,config)
            setLoading(false)
            setSearchResult(data);
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

    const accessChats=async(userId)=>{
        try {
            setLoadingChat(true);
            const config={
                headers:{
                    'Content-type':"Application/json",
                    Authorization:`Bearer ${user.token}`
                }
            }
            const {data}=await axios.post(`/api/chats/`,{userId},config)
            if(!chats.find(c=>c._id==data._id)){
                setChats([data,...chats])
            }
            setLoadingChat(false)
            // s(data);
            setSelectedChat(data)
            onClose()
            
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
 
  return (
    <>
    <Box display={'flex'} justifyContent={"space-between"}
    alignItems={'center'} bg={'white'} w={'100%'} p={'5px 10px 5px 10px'}
    borderWidth={'5px'}>
        <Tooltip label="Search Users" hasArrow placement='bottom-end'>
        <Button variant='ghost' onClick={onOpen}>
            <FaSearch color='black'/>
            <Text display={{base:"none",md:"flex"}} px={'4'}>Search Users</Text>
        </Button>
        </Tooltip>
        <Text fontSize={'2xl'} >
            We-talk
        </Text>
        <div className=' flex justify-center items-center gap-2'>
            <Menu >
                <MenuButton p={1} ml={1} >
                <NotificationBadge count={notification.langth} effect={Effect.SCALE} />
                    <FaRegBell size={20} />
                </MenuButton>
                <MenuList  pl={3}>
                
                {!notification.langth && "No new Messages"}
                {notification?.map(notif=>{
                    return <MenuItem key={notif._id} onClick={()=>{
                        setSelectedChat(notif.chat)
                        setNotification(notification.filter(n=>n!=notif))
                    }}>{
                        notif.chat.groupChat?`New Message in ${notif.chat.chatName}`:`New Message From ${getSender(user,notif.chat.users)}`
                    }</MenuItem>
                })}
                </MenuList>
            </Menu>
            <Menu>
                <MenuButton as={Button} rightIcon={<FaChevronCircleDown/>}>
                    <Avatar size={'sm'} cursor={'pointer'} name={user.name} src={user.avatar} />
                </MenuButton>
                <MenuList>
                <Profile user={user}>

                    <MenuItem>My Profile</MenuItem>
                </Profile>
                    <MenuDivider/>
                    <MenuItem onClick={handleLogOut}>Logout</MenuItem>
                </MenuList>
            </Menu>
        </div>
    </Box>
   
    <Drawer
    
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent >
          <DrawerCloseButton />
          <DrawerHeader>Search Users</DrawerHeader>

          <DrawerBody >
          <Box display={'flex'} pb={2}>

            <Input placeholder='Type here...' value={search} mr={2} onChange={(e)=>setSearch(e.target.value)}/>
            <Button onClick={handleSearch}>Go</Button>
          </Box>
          {
            loading?<ChatLoading/>:(
                searchResult?.map(user=>{
                    return <UserListItem key={user._id} user={user}
                        handleFunction={()=>accessChats(user._id)}
                    />
                })
            )
          }
          {loadingChat && <Spinner ml={'auto'} display={'flex'}/>}
          </DrawerBody>
                
          
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideBar