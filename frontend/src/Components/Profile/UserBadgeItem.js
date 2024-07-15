import { Box } from '@chakra-ui/react'
import React from 'react'
import { GrClose } from 'react-icons/gr'

const UserBadgeItem = ({handleFunction,user}) => {
  return (
   <Box
   px={2}
   py={2}
   borderRadius={'lg'}
   m={1}
   mb={2}
   variant='solid'
   fontSize={12}
   backgroundColor='purple'
   color={'white'}
   cursor={'pointer'}
    display='flex'
    gap={2}
    textAlign={'center'}
    justifyContent={'start'}
    alignItems={'center'}
   onClick={handleFunction}>
    {user.name}
    <GrClose />
   </Box>
  )
}

export default UserBadgeItem