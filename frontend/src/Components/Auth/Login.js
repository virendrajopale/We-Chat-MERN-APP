import {
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    VStack,
    useToast
  } from "@chakra-ui/react";
import axios from "axios";
  import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
  
  const Login = () => {
    const [show, setShow] = useState(false);
   
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
   const toast=useToast()
   const navigate=useNavigate()

    const handleSubmit = async() => {
      setLoading(true);
      if(!email|| !password ){
        toast({
          title:"Please Fill All Data",
          status:"warning",
          duration:5000,
          isClosable:true,
          position:"top"
        })
        setLoading(false)
      }
console.log("hii");
      try {
        const config={
          headers:"application/json"
        }
        const response=await axios.post('/api/user',{email,password},config);
        const data=response.data
        console.log(data);
      toast({
        title:"Login Succedd",
        status:"success",
        duration:5000,
        isClosable:true,
        position:"top"
      });
      localStorage.setItem('userInfo',JSON.stringify(data));
      setLoading(false);
      navigate('chats')
      } catch (error) {
        toast({
          title:"User Error ",
          description:error.response.data.message,
          status:"error",
          duration:5000,
          isClosable:true,
          position:"top"
        });
      }
      setLoading(false)
    };
    return (
      <VStack spacing={"5px"}>
        
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
          value={email}
            placeholder="username@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
  
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={show ? "text" : "password"}
              placeholder="****"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement width={"4.5rem"}>
              <Button
                h={"2rem"}
                size={"sm"}

                background={"none"}
                onClick={() => setShow(!show)}
              >
                {show ? "Show" : "Hide"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
       
       
  
        <Button
          isLoading={loading}
          loadingText="Submitting"
          colorScheme="red"
          onClick={handleSubmit}
          // variant='outline'
          width={"100%"}
        >
          Login
        </Button>
        <Button variant={"solid"}
        colorScheme="yellow"
        width={"100%"} onChange={()=>{
            setEmail('guest@exmple.com')
            setPassword("password")
        }}>
        Guest user creds
        </Button>
      </VStack>
    );
  };
  
  export default Login;
  