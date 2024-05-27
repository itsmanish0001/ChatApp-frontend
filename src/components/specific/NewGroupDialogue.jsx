/* eslint-disable no-unused-vars */
import { useInputValidation } from "6pp";
import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import UserItem from "../shared/UserItem";
import { sampleUsers } from '../../constants/SampleData';
import { useDispatch, useSelector } from "react-redux";
import { useAvailableFriendsQuery, useNewGroupMutation } from "../../redux/api/api";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import { setIsNewGroup } from "../../redux/reducers/misc";
import toast from "react-hot-toast";





const NewGroupDialogue = () => {

  const {isNewGroup} = useSelector((state)=>state.misc);
  const dispatch = useDispatch();

  const {isError, isLoading, error, data} = useAvailableFriendsQuery();

  const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation);

  const errors = [
    {
      isError,
      error,
    }
  ]

  useErrors(errors);

  const groupName = useInputValidation("");
  const [members, setMembers] = useState(sampleUsers);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const selectMemberHandler=(id)=>{

    setSelectedMembers(prev => (prev.includes(id) ?
    prev.filter((currElement) => currElement !==id)
    : [...prev, id])); 

  }

  console.log(selectedMembers);

  const submitHandler = ()=>{
    // console.log("mkj" ,groupName.value, selectedMembers);
    if(!groupName.value){
      return toast.error("Group name is required");
    }

    if(selectedMembers.length < 2){
      return toast.error("please select atleast 3 members");
    }

    newGroup("Creating New Group...",{name:groupName.value, members:selectedMembers})


    closeHandler();

  }

  const closeHandler = () =>{
    dispatch(setIsNewGroup(false));
  }

  return  (
    <Dialog open = {isNewGroup} onClose = {closeHandler}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} width={"25rem"}>
        <DialogTitle>New Group</DialogTitle>

        <TextField label = "Group Name" value = {groupName.value} onChange={groupName.changeHandler}/>

        <Typography textAlign={"center"} variant="body1" marginTop={"1rem"}>Members</Typography>

        <Stack margin={"1rem"}>
        {isLoading? <Skeleton/>:

          (
            data?.friends?.map((i) => (
              <UserItem user={i}
                key={i._id}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(i._id)}
              />
            ))
          )

        }
        </Stack>
        
        <Stack direction={"row"} justifyContent={"space-evenly"}>
          <Button variant="text" color="error" size="large" onClick = {closeHandler} >Cancel</Button>
          <Button variant="contained" size="large" onClick={submitHandler} disabled={isLoadingNewGroup}>Create</Button>
        </Stack>

      </Stack>
    </Dialog>
  )
}

export default NewGroupDialogue
