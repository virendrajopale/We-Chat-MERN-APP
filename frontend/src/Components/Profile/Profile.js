import React from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    IconButton,
    Button,
    Image,
    Text,
  } from '@chakra-ui/react'
  import { GrView } from "react-icons/gr";

const Profile = ({user,children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    
  return (
   <>
    {
        children? <span onClick={onOpen}>{children}</span>:(
            <IconButton display={'flex'} icon={<GrView/>} onClick={onOpen}></IconButton>
        )
    }
    <Modal isOpen={isOpen} onClose={onClose} size={'lg'} isCentered >
        <ModalOverlay  background={"blackAlpha.300"}  backdropFilter='blur(10px)'/>
        <ModalContent h={'410px'}>
          <ModalHeader
          fontSize={'40px'} display={'flex'} justifyContent={'center'}>{user?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
            <Image borderRadius={"full"} boxSize={"150px"} src={user.avatar} alt={user.name} objectFit={'cover'}/>
          <Text fontSize={{base:'28px',md:'30px'}}>{user.email}</Text>
          </ModalBody>

          <ModalFooter>
            
            
          </ModalFooter>
        </ModalContent>
      </Modal>
   </>
  )
}

export default Profile