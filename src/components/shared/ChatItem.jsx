/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import { Link } from '../styles/StyledComponents'
import { Stack, Typography, Box } from '@mui/material'
import { memo } from 'react'
import AvatarCard from './AvatarCard'
import {motion} from 'framer-motion'


const ChatItem = ({
    avatar=[],
    name,
    _id,
    groupChat=false,
    sameSender,
    isOnline,
    newMessageAlert,
    index=0,
    handleDeleteChat,
}) => {
  return (
    <Link to= {`/chat/${_id}`} sx = {{padding:"0"}} onContextMenu={(e)=> handleDeleteChat(e, _id, groupChat)}>
       <motion.div
        initial={{ opacity: 0, y: "-100%" }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * index }}
        style={{
            display:"flex",
            gap:"1rem",
            alignItems:"center",
            padding:"1rem",
            backgroundColor:sameSender?"black":"unset",
            color:sameSender?"white":"unset",
            position:"relative",
        }}>
            <AvatarCard avatar={avatar}/>

            <Stack>
            <Typography>{name}</Typography>
            {
                newMessageAlert && (
                    <Typography> {newMessageAlert.count} New Message </Typography>
                )
            }
            </Stack>

            {isOnline && (
          <Box
            sx={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "green",
              position: "absolute",
              top: "50%",
              right: "1rem",
              transform: "translateY(-50%)",
            }}
          />
        )}

        </motion.div>
    </Link>
  )
}

export default memo(ChatItem)
