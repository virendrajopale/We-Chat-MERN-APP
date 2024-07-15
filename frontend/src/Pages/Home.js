import { Box, Container, Tab,Tabs, TabPanel,TabList, TabPanels, Text } from '@chakra-ui/react'
import React,{useEffect} from 'react'
import Login from '../Components/Auth/Login'
import SignUp from '../Components/Auth/SignUp'
import { Outlet, useNavigate } from 'react-router-dom'

export const Home = () => {
  const navigate=useNavigate()
  useEffect(() => {
     const user=JSON.parse(localStorage.getItem('userInfo'))
     console.log(user);
     if(user){
      navigate('/chats')
     }
  
  }, [navigate]);
  return (
    <Container maxWidth={"xl"} centerContent>
    <Box d="flex" justifyContent={"center"} p={3}
    background={"blackAlpha.300"}  backdropFilter='blur(10px)'  w={"100%"} m={'40px 0 12px 0'} borderRadius={"lg"} borderWidth={"1px"} >
        <Text fontSize={'4xl'} textAlign={"center"}>We-Talk</Text>
    </Box>
    <Box bg={"white"} w={"100%"} borderRadius={'lg'} borderWidth={"1px"} background={"blackAlpha.300"}  backdropFilter='blur(10px)'>
    <Tabs isFitted variant='enclosed' color='White'>
  <TabList mb='1em'>
    <Tab>Login</Tab>
    <Tab>SignUp</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <Login/>
    </TabPanel>
    <TabPanel>
      <SignUp/>
    </TabPanel>
  </TabPanels>
</Tabs>
    </Box>
    {/* <Outlet/> */}
    </Container>
  )
}
