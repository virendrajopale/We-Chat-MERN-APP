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
import axios from 'axios'
import React, { useState } from "react";
import {useNavigate} from 'react-router-dom'
const SignUp = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setconfirmPassword] = useState();
  const [avatar, setAvatar] = useState();
  const [loading, setLoading] = useState(false);
 const navigate=useNavigate()
const toast=useToast()
  const handleUplaodAvatar=async(pic)=>{
    setLoading(true);
    if(pic===undefined){
      toast({
        title:"Please Select Avatar",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"top"
      })
    }
    if(pic.type=="image/jpeg" || pic.type=="image/png" ){
      const formdata=new FormData();
      formdata.append("file",pic);
      formdata.append("upload_preset","chat-app");
      formdata.append("cloud_name","dbetaaewo")
      axios.post("https://api.cloudinary.com/v1_1/dbetaaewo/image/upload", formdata)
        .then((res) => {

        // console.log(data);
        console.log(res.data.url);
        setAvatar(res.data.url.toString());
        setLoading(false)
      })
      .catch(err=>{
        console.log(err);
        setLoading(false)
      })
    }else{
      toast({
        title:"Please Select Avatar",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"top"
      })
      setLoading(false);
      return
    }
    
  }
  const handleSubmit = async() => {
    setLoading(true);
    if(!name|| !email|| !password || !confirmPassword){
      toast({
        title:"Please Fill All Data",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"top"
      })
      setLoading(false)
    }
    if(password!==confirmPassword){
      toast({
        title:"Confirm Password is not equal",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"top"
      })
      setLoading(false)
    }
    try {
      const config={
        headers:"application/json"
      }
      const response=await axios.post('/api/user/register',{name,email,password,avatar},config)
      const data=response.data
      toast({
        title:"User Signup",
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
        status:"error",
        duration:5000,
        isClosable:true,
        position:"top"
      });
    }
    setLoading(false)
    return
  };
  return (
    <VStack spacing={"5px"}>
      <FormControl isRequired>
        <FormLabel>UserName</FormLabel>
        <Input
          placeholder="First name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
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
      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="****"
            onChange={(e) => setconfirmPassword(e.target.value)}
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
      <FormControl isRequired t>
        <FormLabel>Email</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => handleUplaodAvatar(e.target.files[0])}
        />
      </FormControl>

      <Button
        isLoading={loading}
        loadingText="Submitting"
        colorScheme="red"
        onClick={handleSubmit}
        // variant='outline'
        width={"100%"}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
