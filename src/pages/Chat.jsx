/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useRef, useState }  from 'react'
import AppLayout from '../components/layout/AppLayout'
import { IconButton, Skeleton, Stack } from '@mui/material'
import { grayColor, orange } from '../constants/color';
import { AttachFile as AttachFileIcon, Send as SendIcon } from '@mui/icons-material';
import { InputBox } from '../components/styles/StyledComponents';
import FileMenu from '../components/dialogs/FileMenu';
import { sampleMessage } from '../constants/SampleData';
import MessageComponent from '../components/shared/MessageComponent';
import { getSocket } from '../../socket';
import e from 'cors';
import { ALERT, CHAT_JOINED, CHAT_LEAVED, NEW_MESSAGE, START_TYPING, STOP_TYPING } from '../constants/events';
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api';
import { useErrors, useSocketEvents } from '../hooks/hook';
import { useInfiniteScrollTop } from '6pp';
import { useDispatch } from 'react-redux';
import { setIsFileMenu } from '../redux/reducers/misc';
import { removeNewMessagesAlert } from '../redux/reducers/chat';
import { TypingLoader } from '../components/layout/Loaders';
import { useNavigate } from 'react-router-dom';




const Chat = ({chatId, user}) => {
  const navigate = useNavigate();
  const fileMenuRef = useRef(null);
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const dispatch = useDispatch();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const [userTyping, setUserTyping] = useState(false);
  const [IamTyping, setIamTyping] = useState(false);
  const typingTimeout = useRef(null);
 
  
  const socket = getSocket();


  const chatDetails = useChatDetailsQuery({chatId, skip:!chatId});
  const oldMessagesChunk = useGetMessagesQuery({chatId, page})
  
  const errors = [{isError:chatDetails.isError, error: chatDetails.error},
           {isError:oldMessagesChunk.isError, error: oldMessagesChunk.error}];

  
  // console.log(messages)
  const members = chatDetails.data?.chat?.members;

  const {data:oldMessages , setData:setOldMessages } = useInfiniteScrollTop(containerRef,
    oldMessagesChunk.data?.totalPages,
     page,
     setPage,
     oldMessagesChunk.data?.messages)

  console.log("om", oldMessages);

  
  
  const submitHandler = (e)=>{
    e.preventDefault();
    // console.log(message);
    if(!message.trim()) return;

    

    socket.emit(NEW_MESSAGE, {chatId, members, message}); 
    setMessage("");
  }

  const handleFileOpen = (e) =>{
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  }

  const newMessagesListener = useCallback((data)=>{
    if(data.chatId !== chatId){
      return;
    }

    console.log(data);
    setMessages((prev) => [...prev, data.message])
  },[chatId]);


  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      console.log("start typing" , data);

      setUserTyping(true);
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      console.log("stop typing" , data);
      setUserTyping(false);

      
    },
    [chatId]
  );

 
  const alertListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      const messageForAlert = {
        content: data.message,
        sender: {
          _id: "djasdhajksdhasdsadasdas",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );


  const eventHandler = {
    [ALERT]:alertListener,
    [NEW_MESSAGE]: newMessagesListener,
    [START_TYPING] : startTypingListener,
    [STOP_TYPING] :stopTypingListener,

  };

  useSocketEvents(socket, eventHandler);
  useErrors(errors);

  const allMessages = [...oldMessages, ...messages];


  useEffect(() => {
    socket.emit(CHAT_JOINED, { userId: user._id, members });
    dispatch(removeNewMessagesAlert(chatId));

    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
      socket.emit(CHAT_LEAVED, { userId: user._id, members });
    };
  }, [chatId]);

  useEffect(()=>{
    if(chatDetails.isError){
      return navigate("/");
    }
  }, [chatDetails.isError]);


  useEffect(()=>{
    if(bottomRef.current){
      bottomRef.current.scrollIntoView({behavior:"smooth"});
    }
  }, [messages])

  
  const messageOnChange = (e) =>{
    setMessage(e.target.value);
    if(!IamTyping){
      socket.emit(START_TYPING, {members, chatId});
      setIamTyping(true);
      // console.log("type krra hu");
    }

    if(typingTimeout.current){
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current  = setTimeout(()=>{
      socket.emit(STOP_TYPING, {members, chatId}) 
      setIamTyping(false);
    }, [2000]);
    
  }

  
  
  


  return chatDetails.isLoading? (<Skeleton/>) : (
    <>
    <Stack ref = {containerRef}
    boxSizing={"border-box"}
    padding={"1rem"}
    spacing={"1rem"}
    bgcolor={grayColor}
    height={"90%"}
    sx={{
      overflowX:"hidden",
      overflowY:"auto",
    }}
    >
     
      {
        allMessages.map((i) => (
          <MessageComponent message={i} user={user} key = {i._id}/>
        ))
      }

      {
        userTyping && <TypingLoader/>
      }

      <div ref={bottomRef} />

      

    </Stack>

    <form style={{
            height:"10%",

    }} onSubmit={submitHandler}>

    <Stack direction={"row"} 
    height={"100%"}
    padding={"1rem"}
    alignItems={"center"}
    position={"relative"}
    >
      <IconButton sx = {{
        position:"absolute",
        left:"1.5rem",
        rotate:"30deg"
      }} onClick={handleFileOpen}  >
        <AttachFileIcon/>
      </IconButton>
      <InputBox placeholder='Type your message here...' value = {message} onChange={messageOnChange} />
      <IconButton type="submit" sx={{
                    rotate:"-30deg",
                    backgroundColor: orange,
                    color:"white",
                    marginLeft:"1rem",
                    padding:"0.5rem",
                    "&:hover":{
                      bgcolor:"error.dark"
                    }
      }}>
        <SendIcon/>
      </IconButton>
    </Stack>

    </form>
      <FileMenu anchorEl={fileMenuAnchor} chatId = {chatId} />
      
    </>
  )


}

export default AppLayout()(Chat)
