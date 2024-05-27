/* eslint-disable no-unreachable */
/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  ListItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React, { memo } from 'react'
import { sampleNotifications } from '../../constants/SampleData'
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from "../../redux/api/api";
import { useErrors } from "../../hooks/hook";
import { useDispatch, useSelector } from "react-redux";
import { setIsNotification } from "../../redux/reducers/misc";
import { asyncThunkCreator } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const Notification = () => {

  const dispatch = useDispatch();


  const friendRequestHandler = async({ _id, accept }) => {

    try{
      const res = await acceptRequest({requestId: _id, accept });

      if(res.data?.success){
        console.log("use socket here");
        toast.success(res.data.message)
      }
      else{
        toast.error(res.data?.error || "something went wrong");
      }
    }

    catch(error){
      toast.error("something went wrong");
      console.log("error");
    }

    dispatch(setIsNotification(false));
    
  }

  const { isLoading, data, error, isError } = useGetNotificationsQuery();
  const [acceptRequest] = useAcceptFriendRequestMutation();
  console.log(data);
  const {isNotification} =  useSelector((state)=>state.misc);

  useErrors([{ error, isError }]);

  const closeHandler = ()=>{
    dispatch(setIsNotification(false));
  }


  return (
    <Dialog open={isNotification} onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
        <DialogTitle>Notifications</DialogTitle>

        {
          isLoading ? <Skeleton /> : (<>
            {

              data?.allRequests.length > 0 ? (
                data?.allRequests.map(({ sender, _id }) => <NotificationItem
                  sender={sender}
                  _id={_id}
                  key={_id}
                  handler={friendRequestHandler}
                />)
              ) : (<Typography textAlign={"center"}>No Notification</Typography>)

            }
          </>)
        }

      </Stack>
    </Dialog>
  )
}




const NotificationItem = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender;
  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
      >
        <Avatar />

        <Typography
          variant="body1"
          sx={{
            flexGlow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
          }}
        >
          {`${name} sent you a friend request.`}
        </Typography>

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
        >
          <Button onClick={() => handler({ _id, accept: true })}>Accept</Button>
          <Button color="error" onClick={() => handler({ _id, accept: false })}>
            Reject
          </Button>
        </Stack>
      </Stack>
    </ListItem>
  );
});

export default Notification;
