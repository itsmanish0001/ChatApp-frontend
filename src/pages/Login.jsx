/* eslint-disable no-unused-vars */
import { Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { CameraAlt as CameraAltIcon } from '@mui/icons-material';
import { VisuallyHiddenInput } from '../components/styles/StyledComponents';
import { useFileHandler, useInputValidation, useStrongPassword } from '6pp';
import { usernameValidator } from '../utils/validator';
import { server } from '../constants/config';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { userExists } from '../redux/reducers/auth';
import toast from 'react-hot-toast';


const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [isLogin, setIsLogin] = useState(true);

  const toggleLogin = () => setIsLogin(!isLogin)

  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const password = useStrongPassword();
  const avatar = useFileHandler("single");

  const dispatch = useDispatch();

  const handleLogin = async(e) =>{
    e.preventDefault();
   const toastId = toast.loading("Logging In...");
    setIsLoading(true);
    const config = {
      withCredentials:true,
      headers:{
        "Content-Type": "application/json",
      },
    };

    try{
      const {data} = await axios.post(`${server}/api/v1/user/login`, {
        username:username.value,
        password:password.value,
      },
      config
    );
    console.log(data);

    dispatch(userExists(data.user))
    toast.success(data.message, {id:toastId});
    }
    catch(error){
      toast.error(error?.response?.data?.message || "something went wrong", {id:toastId});
    }
    finally{
      setIsLoading(false);
    }
  }

  const handleSignUp = async(e) =>{
    e.preventDefault();
    const toastId = toast.loading("Signing Up...");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("username", username.value);
    formData.append("password", password.value);

    const config = {
      withCredentials:true,
      headers:{
        "Content-Type":"multipart/form-data",
      },
    }

    try{
      const {data} = await axios.post(`${server}/api/v1/user/new`, formData, config);
      dispatch(userExists(data.user))
      toast.success(data.message, {id:toastId});
      console.log("try")
    }

    catch(error){
      console.log(error);
      toast.error(error?.response?.data?.message ||"something went wrong", {id:toastId});
      console.log("catch")

    }
    finally{
      setIsLoading(false);
    }

  }


  return (
    <div style = {{backgroundImage: "linear-gradient(rgb(200, 200, 200), rgb(34 29 29))"}}>
    <Container component={"main"} maxWidth="xs" sx = {{height:"100vh", display:"flex", justifyContent:"center", alignItems:"center"}}>

      <Paper elevation={3} 
      sx={{
        padding:4,
        display:"flex",
        flexDirection:"column",
        alignItems:"center", 
      }}
      >

        {isLogin? (
          <>
          <Typography variant='h5'>Login</Typography>
          <form style = {{width:"100%", marginTop:"1rem"}}  onSubmit={handleLogin}>
            <TextField required fullWidth label="Username" margin="normal" variant="outlined" value = {username.value} onChange={username.changeHandler}/>
            <TextField required fullWidth label="Password" type='password' margin="normal" variant="outlined" value = {password.value} onChange={password.changeHandler} />
            <Button sx={{marginTop:"1rem"}} variant='contained' fullWidth color="primary" type="submit" disabled={isLoading}>Login</Button>
            <Typography textAlign={"center"} sx = {{margin:"1rem"}}>Or</Typography>
            <Button sx = {{marginTop:"1rem"}} fullWidth variant='text' onClick={toggleLogin} disabled={isLoading}>Sign up Instead</Button>
          </form>
          </>

        ):(
        <>
             <Typography variant='h5'>Sign Up</Typography>
          <form style = {{width:"100%", marginTop:"1rem"}} onSubmit={handleSignUp}>
           <Stack sx = {{position:"relative", width:"10rem", margin:"auto"}}>
           <Avatar sx = {{width:"10rem", height:"10rem", objectFit:"contain"}} src = {avatar.preview}/>
           <IconButton
                    sx={{
                      position: "absolute",
                      bottom: "0",
                      right: "0",
                      color: "white",
                      bgcolor: "rgba(0,0,0,0.5)",
                      ":hover": {
                        bgcolor: "rgba(0,0,0,0.7)",
                      },
                    }}
                    component="label"
            
                  >
            <>
            <CameraAltIcon/>
            <VisuallyHiddenInput type = "file" onChange={avatar.changeHandler}/>
            </>
           </IconButton>

          
           </Stack>
          <TextField required fullWidth label="Name" margin="normal" variant="outlined" value = {name.value} onChange={name.changeHandler}/>
          <TextField required fullWidth label="Bio" margin="normal" variant="outlined" value = {bio.value} onChange={bio.changeHandler}/>
            <TextField required fullWidth label="Username" margin="normal" variant="outlined" value = {username.value} onChange={username.changeHandler}/>
            {
              username.error && (
                <Typography color = "error" variant="caption">
                  {username.error}
                </Typography>
              )
            }
            <TextField required fullWidth label="Password" type='password' margin="normal" variant="outlined" value = {password.value} onChange={password.changeHandler}/>
            {
              password.error && (
                <Typography color = "error" variant="caption">
                  {password.error}
                </Typography>
              )
            }
            <Button sx={{marginTop:"1rem"}} variant='contained' fullWidth color="primary" type="submit" disabled={isLoading}>Sign Up</Button>
            <Typography textAlign={"center"} sx = {{margin:"1rem"}}>Or</Typography>
            <Button sx = {{marginTop:"1rem"}} fullWidth variant='text' onClick={toggleLogin} disabled={isLoading}>Login Instead</Button>
          </form>

        </>)}

      </Paper>

    </Container>
    </div>
  )
}

export default Login
