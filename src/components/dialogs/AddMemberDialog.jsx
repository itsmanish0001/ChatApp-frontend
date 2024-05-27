
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Button, Dialog, DialogTitle, Skeleton, Stack, Typography } from '@mui/material'
import React, {useState} from 'react'
import { sampleUsers } from '../../constants/SampleData'
import UserItem from '../shared/UserItem'
import { useAsyncMutation, useErrors } from '../../hooks/hook'
import { useAddGroupMembersMutation, useAvailableFriendsQuery } from '../../redux/api/api'
import { useDispatch, useSelector } from 'react-redux'
import { setIsAddMember } from '../../redux/reducers/misc'

const AddMemberDialog = ({chatId}) => {

  const [members, setMembers] = useState(sampleUsers);
  const dispatch = useDispatch();
  const {isAddMember} = useSelector(state => state.misc);
  const {isLoading, data, isError, error} = useAvailableFriendsQuery(chatId);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [addMembers, isLoadingAddMembers] = useAsyncMutation(useAddGroupMembersMutation);



  const selectMemberHandler=(id)=>{

    setSelectedMembers(prev => (prev.includes(id) ?
    prev.filter((currElement) => currElement !==id)
    : [...prev, id])); 

  }

    const addMemberSubmitHandler=()=>{
        addMembers("Adding User...", {chatId, members:selectedMembers});
        closeHandler();

    }


    const closeHandler = () =>{

        setSelectedMembers([]);
        setMembers([]);
        dispatch(setIsAddMember(false));
    }

    useErrors([{
        error, 
        isError
    }])

  return (
   <Dialog open = {isAddMember} onClose={closeHandler}>
    <Stack spacing={"2rem"} width={"20rem" } p = {"2rem"} >
        <DialogTitle   textAlign={"center"}>Add Member</DialogTitle>
        <Stack spacing={"1rem"}>
            {   isLoading? (<Skeleton/>):
               ( data?.friends?.length > 0 ? (
                data?.friends?.map(i=>(
                    <UserItem key={i._id} user={i} handler={selectMemberHandler} isAdded={selectedMembers.includes(i._id)}/>
                ))
            )
            :
            (
                <Typography textAlign={"center"}>No Friends</Typography>
            ))
            }
        </Stack>

        <Stack direction={"row"} alignItems={"center"} justifyContent={"space-evenly"}>
            <Button color="error" onClick={closeHandler} >Cancel </Button>
            <Button variant='contained'  onClick={addMemberSubmitHandler} >Submit Changes</Button>
        </Stack>
    </Stack>
   </Dialog>
  )
}

export default AddMemberDialog
