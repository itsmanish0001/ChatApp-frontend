/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { Suspense, useState } from 'react'
import { lazy } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { AppBar, Backdrop, Badge, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import { orange } from '../../constants/color'
import {Logout as LogOutIcon, Group as GroupIcon, Menu as MenuIcon, Search as SearchIcon, Add as AddIcon, Notifications as NotificationsIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
const SearchDialogue = lazy(()=>import("../specific/SearchDialogue.jsx"))
const NewGroupDialogue = lazy(()=>import("../specific/NewGroupDialogue.jsx"))
const NotificationDialogue = lazy(()=>import("../specific/NotificationDialogue.jsx"))
import { server } from '../../constants/config.js'
import { useDispatch, useSelector } from 'react-redux'
import { userNotExists } from '../../redux/reducers/auth.js'
import { setIsMobile, setIsNewGroup, setIsNotification, setIsSearch } from '../../redux/reducers/misc.js'
import { resetNotificationCount } from '../../redux/reducers/chat.js'

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {isNewGroup} = useSelector((state)=>state.misc);

    const {isSearch, isNotification} = useSelector(state => state.misc);
    const {notificationCount} = useSelector((state) => state.chat);
    console.log(notificationCount);

    
   
    


    const handleMobile = () => {
        console.log("mobile");
        dispatch(setIsMobile(true));
    }

    const openSearchDialog=()=>{
        console.log("open search dialog")
        dispatch(setIsSearch(true));
    }

    const openNewGroup=()=>{
        console.log("open new group")
        dispatch(setIsNewGroup(true));
    }

    const NavigateToGroups=()=>{
        console.log("navigate to groups");
        navigate("/groups")
    }

    const LogOutHandler=async()=>{

        try{
            const {data} = await axios.get(`${server}/api/v1/user/logout`, {
                withCredentials:true,
            });
            dispatch(userNotExists());
            toast.success(data.message);
        }
        catch(error){
            toast.error(error?.response?.data?.message || "something went wrong");
        }
    }

    const openNotification=()=>{
        dispatch(setIsNotification(true));
        dispatch(resetNotificationCount());

    }

  return (
   <>
   <Box sx={{flexGrwo:1}} height={"4rem"}>
    <AppBar position='static' sx={{bgcolor:orange}}>
        <Toolbar>
            <Typography variant = "h6" sx = {{display:{xs:"none", sm:"block"}}}>
                Chat-App
            </Typography>

            <Box sx={{display:{xs:"block", sm:"none"},}}>
                <IconButton color = "inherit" onClick={handleMobile}>
                    <MenuIcon/>
                </IconButton>
            </Box>
            <Box sx={{flexGrow:1,}}/>
            <Box>
              <IconBtn title={"Search"} icon={<SearchIcon/>} onClick={openSearchDialog}/>

              <IconBtn title={"New Group"} icon={<AddIcon/>} onClick={openNewGroup}/>
               
              <IconBtn title={"Manage Groups"} icon={<GroupIcon/>} onClick={NavigateToGroups}/>

              <IconBtn title={"Notifications"} icon={<NotificationsIcon />} onClick={openNotification} value={notificationCount} />

              <IconBtn title={"LogOut"} icon={<LogOutIcon/>} onClick={LogOutHandler}/>

                
            </Box>
        </Toolbar>
    </AppBar>

   </Box>


    {isSearch && (
        <Suspense fallback={<Backdrop open/>}>
            <SearchDialogue/>
        </Suspense>
    )}

    {isNotification && (
        <Suspense fallback={<Backdrop open/>}>
            <NotificationDialogue/>
        </Suspense>
    )}

    {isNewGroup && (
        <Suspense fallback={<Backdrop open/>}>
            <NewGroupDialogue/>
        </Suspense>
    )}


   </>
  )
}


const IconBtn = ({ title, icon, onClick, value }) => {
    return (
        <Tooltip title={title}>
                <IconButton color="inherit" size="large" onClick={onClick} >
                    {
                        value? <Badge badgeContent={value} color='error'> {icon} </Badge> : icon
                    }
                
                </IconButton>
        </Tooltip>
    );
};


export default Header
