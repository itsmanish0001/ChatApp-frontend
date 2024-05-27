/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Grid, IconButton, Tooltip, Drawer, Stack, Typography, TextField, Button, Backdrop, CircularProgress } from '@mui/material'
import React, { Suspense, lazy, memo, useEffect, useState } from 'react'
import { bgGradient, matBlack, orange } from '../constants/color'
import { Add as AddIcon, Delete as DeleteIcon, Done as DoneIcon, Edit as EditIcon, KeyboardBackspace as KeyboardBackspaceIcon, Menu as MenuIcon, SportsRugbySharp } from '@mui/icons-material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Link } from '../components/styles/StyledComponents'
import AvatarCard from '../components/shared/AvatarCard'
import { samepleChats, sampleUsers } from '../constants/SampleData'
import UserItem from '../components/shared/UserItem'
import { useAddGroupMembersMutation, useChatDetailsQuery, useDeleteChatMutation, useMyGroupsQuery, useRemoveGroupMemberMutation, useRenameGroupMutation } from '../redux/api/api'
import { useAsyncMutation, useErrors } from '../hooks/hook'
import { LayoutLoaders } from '../components/layout/Loaders'
import { useDispatch, useSelector } from 'react-redux'
import { setIsAddMember } from '../redux/reducers/misc'

const ConfirmDeleteDialog = lazy(()=>import("../components/dialogs/ConfirmDeleteDialog"))
const AddMemberDialog = lazy(()=>import("../components/dialogs/AddMemberDialog"))
const isAddMember = false;


const Groups = () => {

  const dispatch = useDispatch();
  const {isAddMember} = useSelector(state => state.misc);

  const chatId = useSearchParams()[0].get("group");
  // console.log(chatId);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false); 
  const [groupName, setGroupName] = useState("")
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("")
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [members, setMembers] = useState([]);

  const myGroups = useMyGroupsQuery("");
  const groupDetails = useChatDetailsQuery({chatId, populate:true},{skip:!chatId});

  const [updateGroup, isLoadingGroupName] = useAsyncMutation(useRenameGroupMutation);
  const [removeMember, isLoadingRemoveMember] = useAsyncMutation(useRemoveGroupMemberMutation);
  const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(useDeleteChatMutation);
  
  const errors = [{
    isError: myGroups.isError,
    error:myGroups.error,
  },
  {
    isError: groupDetails.isError,
    error:groupDetails.error,
  }
]

useEffect(() => {
  const groupData = groupDetails.data;
  if (groupData) {
    setGroupName(groupData.chat.name);
    setGroupNameUpdatedValue(groupData.chat.name);
    setMembers(groupData.chat.members);
  }

  return () => {
    setGroupName("");
    setGroupNameUpdatedValue("");
    setMembers([]);
    setIsEdit(false);
  };
}, [groupDetails.data]);

  // console.log(groupDetails);

  useErrors(errors);

  console.log(" hkl ", myGroups.data);

  const navigateBack = ()=>{

    navigate("/");
   
  }

  const handleMobile=()=>{
    console.log(isMobileMenuOpen);
    setIsMobileMenuOpen(!isMobileMenuOpen);
    
  }
  const handleMobileClose=()=>{
    setIsMobileMenuOpen(false);
  }

  const updateGroupName = ()=>{
    console.log("grup name updated");
    console.log(groupNameUpdatedValue);
    setIsEdit(false);
    updateGroup( "Updating Group Name",{name:groupNameUpdatedValue, chatId});
  }

  const openConfirmDeleteHandler = ()=>{
    setConfirmDeleteDialog(true)

  }

  const closeConfirmDeleteHandler = () =>{
    setConfirmDeleteDialog(false);
  }

  const deleteHandler = ()=>{
    console.log("delete handler")
    closeConfirmDeleteHandler();

  }

  const openAddMemberHandler = ()=>{
      dispatch(setIsAddMember(true));
  }

  const removeMemberHandler = (userId)=>{
   console.log("scx");
    removeMember("Removing Member...", {chatId, userId});

  }

  useEffect(()=>{
    if(chatId){
      setGroupName(`Group Name ${chatId}`)
      setGroupNameUpdatedValue(`updated group name ${chatId}`)
    }

    return ()=>{
      setGroupName("");
      setGroupNameUpdatedValue("");
      setIsEdit(false)
    }

  }, [chatId])

  
    const IconBtns = (
      <>

     <Tooltip title="menu">
     <IconButton 
        sx={{
          display:{
            xs:"block",
            sm:"none",
            position:"fixed",
            right:"1rem",
            top:"1rem"
          },

          "&:hover":{
            bgcolor:"gray"
          }
        }}

        onClick={handleMobile}
      >

      <MenuIcon/>

      </IconButton>
     </Tooltip>

    <Tooltip title="back">
      <IconButton sx={{
        position:"absolute",
        top:"2rem",
        left:"2rem",
        bgcolor:matBlack,
        color:"white",
        "&:hover":{
          bgcolor:"grey",
          color:"black"
        }
      }} onClick={navigateBack} >
        <KeyboardBackspaceIcon/>
      </IconButton>
    </Tooltip>

    </>

    )

    const GroupName = ( 
      <Stack 
      direction={"row"}
      alignItems={"center"}
      justifyContent={"center"}
      spacing={"1rem"}
      padding={"1rem"}
      >
        {isEdit? (
        <>
        <TextField value = {groupNameUpdatedValue} onChange={(e)=>setGroupNameUpdatedValue(e.target.value)} />
        <IconButton onClick = {updateGroupName} disabled={isLoadingGroupName} ><DoneIcon/></IconButton>
        </>):(
        <>
        
         <Typography variant='h4'>{groupName}</Typography>
         <IconButton onClick={()=>setIsEdit(true)} disabled={isLoadingGroupName} ><EditIcon/></IconButton>
         
        </>) }
      </Stack>
    )


    const ButtonGroup = <Stack
      direction={{
        xs:"column-reverse",
        sm:"row"
      }}
      spacing={"1rem"}
      p={{
        xs:"0",
        sm:"1rem",
        md:"1rem 4rem"
      }}
    
    >
      <Button size="large" color="error" variant='outlined' startIcon={<DeleteIcon/>} onClick={openConfirmDeleteHandler}>Delete Group</Button>
      <Button size="large" variant='contained' startIcon={<AddIcon/>} onClick={openAddMemberHandler} >Add Member</Button>

    </Stack>
  



  return ( myGroups.isLoading? <LayoutLoaders/>:

   <Grid container height={"100vh"}>

    <Grid 
    item
    sx={{
      display:{
        xs:"none",
        sm:"block",
      },
      
      
    }}
    sm={4}
    
    >
       <GroupsList myGroups={myGroups?.data?.groups} chatId={chatId} />
    </Grid>

    <Grid item xs={12} sm={8}
    sx={{
      display:"flex",
      flexDirection:"column",
      alignItems:"center",
      position:"relative",
      padding:"1rem 3rem",
    }}
    >
      {IconBtns}
      {groupName && (

        <>
        
        {GroupName}

        <Typography
        margin={"2rem"}
        alignSelf={"flex-start"}
        variant='body1'>
          Members
        </Typography>

        <Stack
          maxWidth={"45rem"}
          width={"100%"}
          boxSizing={"border-box"}
          padding={{
            sm:"1rem",
            xs:"0",
            md:"1rem 4rem"
          }}
          spacing={"2rem"}
          height={"50vh"}
          overflow={"auto"}
        >

          {/* Members */}
          {
            isLoadingRemoveMember? <CircularProgress/> :
            (members.map((i)=>(
              <UserItem
               user={i}
               key={i._id} 
               isAdded 
               styling={{
                boxShadow:"0 0 0.5rem rgba(0,0,0,0.2)",
                padding:"1rem 2rem",
                borderRadius:"1rem"
              }}
              handler={removeMemberHandler}
              />
            )))
          }

        </Stack>

        {ButtonGroup}



        </>
      )

       
      
      }

    </Grid>

    {
      isAddMember && <Suspense fallback={<Backdrop open/>}>
        <AddMemberDialog chatId={chatId}/>
      </Suspense>
    }

    {confirmDeleteDialog && <Suspense fallback={<Backdrop open/>}>
      <ConfirmDeleteDialog
       open = {confirmDeleteDialog}
       handleClose={closeConfirmDeleteHandler}       
       deleteHandler={deleteHandler}              
      />
    </Suspense>
    }

    <Drawer open={isMobileMenuOpen} onClose={handleMobileClose} sx={{
      display:{
        xs:"block",
        sm:"none"
      },
      
    }} >

      <GroupsList w={"50vw"} myGroups={myGroups?.data?.groups} chatId={chatId}/>

    </Drawer>

   </Grid>
  )
}

const GroupsList = ({w="100%", myGroups=[], chatId}) =>
  
 (
  
  <Stack width={w}
      sx={{
        backgroundImage:bgGradient,
        height:"100vh"
      }}
      overflow={"auto"} 
      height={"100%"}
  
  >
    
    {
      myGroups.length > 0? myGroups.map((group)=>
        <GroupListItem group={group} chatId={chatId} key={group._id}/>
      ): (<Typography textAlign={"center"} padding={"1rem"}>No Groups</Typography>)
    }
  </Stack>
  
)
  





const GroupListItem = memo(({group, chatId}) => {

  const {name, avatar, _id} = group;

  return (
    <Link to={`?group=${_id}`} onClick={(e)=>{
      if(chatId === _id) e.preventDefault();
    }}  >
    <Stack direction={"row"} alignItems={"center"} spacing={"1rem"} >
      <AvatarCard avatar={avatar} />
      <Typography>{name}</Typography>
    </Stack>
    </Link>
  )

})



export default Groups
