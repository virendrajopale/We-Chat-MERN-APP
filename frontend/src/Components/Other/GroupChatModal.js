import { Box, Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/Chatprovider';
import axios from 'axios';
import UserListItem from '../Profile/UserListItem';
import UserBadgeItem from '../Profile/UserBadgeItem';

const GroupChatModal = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setgroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState();
    const [searchResults, setSearchResults] = useState();
    const [loading, setLoading] = useState();
    const initialRef = React.useRef(null)
  const finalRef = React.useRef(null)
  const toast=useToast()
  const {user,chats,setChats}=ChatState()
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
  const handleSubmit=async()=>{
    if(!groupChatName || !selectedUsers){
        toast({
            title:"Please Add Group Name and Add Users",
            status:"warning",
            duration:5000,
            isClosable:true,
            position:"top-left"
          }) 
          return
    }
    try {
        const config={
            headers:{
                Authorization:`Bearer ${user.token}`
            }
        }
        const {data}=await axios.post('/api/chats/group',{
            name:groupChatName,
            users:JSON.stringify(selectedUsers.map(s=>s.id))
        },config)
        setChats([data,...chats])
        onClose()
        toast({
            title:`${groupChatName} is Created`,
            status:"success",
            duration:5000,
            isClosable:true,
            position:"top-left"
          }) 
         
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
  const handleGroup=(user)=>{
    if(selectedUsers.includes(user)){
        toast({
            title:"User Already Exist",
            status:"warning",
            duration:5000,
            isClosable:true,
            position:"bottom-left"
          }) 
          return
    }
    setSelectedUsers([...selectedUsers,user])
  }
  const handleDelete=(user)=>{
     setSelectedUsers(selectedUsers.filter(sel=>user._id!=sel._id))
  }
  return (
    <>

    <div onClick={onOpen} >{children}</div>
   

    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
        
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize={'35px'} display={'flex'} justifyContent={'center'}>Create Group</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Group Name </FormLabel>
            <Input ref={initialRef} placeholder='Chat name'
            onChange={(e)=>setgroupChatName(e.target.value)} />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>add users</FormLabel>
            <Input placeholder='Add Users' onChange={(e)=>handleSearch(e.target.value)}/>
          </FormControl>
          <Box display={'flex'} flexWrap={'wrap'} w={'100%'} alignItems={'center'}>

          {selectedUsers?.map(user=>{
            return <UserBadgeItem key={user._id} user={user} handleFunction={()=>handleDelete(user)}/>
          })}
          {/* {Users} */}
          {loading?<Spinner/>:(
            searchResults?.slice(0,4)?.map(user=>{
                return <UserListItem key={user._id} user={user} handleFunction={()=>handleGroup(user)}/>
            })
          )}
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={handleSubmit} >
            Create Group
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>
  )
}

export default GroupChatModal