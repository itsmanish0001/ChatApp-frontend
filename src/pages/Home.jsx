/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React from 'react'
import AppLayout from '../components/layout/AppLayout'
import { Box, Typography } from '@mui/material';

const Home = () => {
  return (
   <Box bgcolor={"gray"} height={"100%"}>
     <Typography p={"2rem"} variant="h5" textAlign={"center"}>Select a Friend to Chat</Typography>
   </Box>
  )
}

export default AppLayout()(Home);
