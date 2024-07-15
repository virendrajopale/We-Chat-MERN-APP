import { Box, Button, FormControl, FormLabel, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { MdGroups } from "react-icons/md";
import { ChatState } from '../../Context/Chatprovider';
import UserBadgeItem from '../Profile/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../Profile/UserListItem';

const UpdateGroupModal = ({fetchAgain,setfetchAgain,getAllMessages}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const {user,selectedChat,setSelectedChat}=ChatState()
    const [groupName, setGroupName] = useState();
    const [search, setSearch] = useState();
    const [searchResults, setSearchResults] = useState();
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);
    const toast=useToast()
    
    const handleAddUsers=async(passedUser)=>{
     
        if(selectedChat.users.find((u)=>u._id==passedUser._id)){
            toast({
                title:"User Already In group ",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"top-left"
              }) 
              return
        }
        if(selectedChat.groupAdmin._id!==user._id){
            toast({
                title:"You are Not Admin",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"top-left"
              }) 
              return
        }
        try {
            setLoading(true)
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }
            const {data}=await axios.put('/api/chats/addToGrpup',{
                chatId:selectedChat._id,
                userId:passedUser._id
            },config)
            setSelectedChat(data)
            setfetchAgain(!fetchAgain)
            setLoading(false)
        } catch (error) {
            toast({
                title:"Error",
                status:"error",
                duration:5000,
                isClosable:true,
                position:"top-left"
              }) 
              setLoading(false)
        }
    }
    const handleRemoveUser=async(passedUser)=>{
       
        if(selectedChat.groupAdmin._id!==user._id && passedUser._id!==user._id){
            toast({
                title:"You Cannot Remove admin",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"top-left"
              }) 
              return
        }
        try {
            setLoading(true)
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }
            const {data}=await axios.put('/api/chats/groupRemove',{
                chatId:selectedChat._id,
                userId:passedUser._id
            },config)
            passedUser._id=user._id?setSelectedChat(""):setSelectedChat(data)
            setfetchAgain(!fetchAgain)
            getAllMessages()
            setLoading(false)
        } catch (error) {
            toast({
                title:"Error",
                status:"error",
                duration:5000,
                isClosable:true,
                position:"top-left"
              }) 
        }
    }
    const handleRename=async()=>{
        if(!groupName){
            toast({
                title:"Please Edit Group Name ",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"top-left"
              }) 
            return
        }
        try {
            setRenameLoading(true)
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }
          console.log(selectedChat._id,groupName);
            const {data}=await axios.put('/api/chats/rename',{
                chatId:selectedChat._id,
                chatName:groupName},config)
                setSelectedChat(data)
                setRenameLoading(false)
                setfetchAgain(!fetchAgain)
                toast({
                    title:`${groupName } Updated Successfully`,
                    status:"success",
                    duration:5000,
                    isClosable:true,
                    position:"top-left"
                  }) 
                // onClose()
        } catch (error) {
            toast({
                title:"Error",
                status:"error",
                duration:5000,
                isClosable:true,
                position:"top-left"
              }) 
            setRenameLoading(false)
        }
        setGroupName('')
    }
    const handleSearch=async(query)=>{
        setSearch(query)
        if(!query){
            return
        }
        try {
            setLoading(true)
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }
            const {data}=await axios.get(`/api/user?search=${search}`,config)
            setLoading(false)
            setSearchResults(data)
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
    return (
        <>
          <IconButton onClick={onOpen} icon={<MdGroups/>} display={'flex'}>Open Modal</IconButton>
    
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{selectedChat?.chatName}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
               <Box w={'100%'} display={'flex'} flexWrap={'wrap'} pb={3}>
                {
                    selectedChat?.users?.map(u=>{
                        return <UserBadgeItem key={u._id} user={u} handleFunction={()=>handleRemoveUser(u)}/>
                    })
                }
               </Box>
               <FormControl display={'flex'}>
                <Input placeholder='Update Group name'
                    mb={3}
                    value={groupName}
                    onChange={(e)=>setGroupName(e.target.value)}
                />
                <Button variant={'solid'}
                colorScheme='teal'
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}>
                Update
                </Button>
               </FormControl>
               <FormControl mt={4}>
            <FormLabel>add users</FormLabel>
            <Input placeholder='Add Users' onChange={(e)=>handleSearch(e.target.value)}/>
          </FormControl>
          <Box display={'flex'} flexWrap={'wrap'} w={'100%'} alignItems={'center'}>

         
        
          {loading?<Spinner/>:(
            searchResults?.slice(0,4)?.map(user=>{
                return <UserListItem key={user._id} user={user} handleFunction={()=>handleAddUsers(user)}/>
            })
          )}
          </Box>
              </ModalBody>
    
              <ModalFooter>
                <Button colorScheme='red' mr={3} onClick={()=>handleRemoveUser(user)}>
                  Leave Group
                </Button>
                <Button variant='ghost'>Secondary Action</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
}

export default UpdateGroupModal