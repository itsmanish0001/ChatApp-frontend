/* eslint-disable no-unused-vars */
import React, {Suspense, lazy} from 'react'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import ProtectRoute from './components/auth/ProtectRoute';
import { LayoutLoaders } from './components/layout/Loaders';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';


import { server } from './constants/config';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { userExists, userNotExists } from './redux/reducers/auth';
import { SocketProvider } from '../socket';

const Home = lazy(()=>import("./pages/Home"));
const Login = lazy(()=>import("./pages/Login"));
const Chat = lazy(()=>import("./pages/Chat"));
const Groups = lazy(()=>import("./pages/Groups"));
const NotFound = lazy(()=>import("./pages/NotFound"));
const AdminLogin = lazy(()=>import("./pages/admin/AdminLogin"))







const App = () => {

  const {user, Loader} = useSelector(state => state.auth)

  const dispatch = useDispatch()

  useEffect(()=>{

      axios.get(`${server}/api/v1/user/me`, {withCredentials:true})
      .then(({data})=>dispatch(userExists(data.user)))
      .catch((err)=>dispatch(userNotExists()));
    
  }, [dispatch])



  return Loader?(<LayoutLoaders/>): (
    <BrowserRouter>
    <Suspense fallback={<LayoutLoaders/>}>
    <Routes>
      <Route element = {<SocketProvider>
        <ProtectRoute user = {user}/>
        </SocketProvider>}
        >
      <Route path = "/" element={<Home/>} />
      <Route path = "/chat/:chatId" element={<Chat/>} />
      <Route path = "/Groups" element={<Groups/>} />
      </Route>
      <Route path = "/login" element={<ProtectRoute user = {!user} redirect = "/">
        <Login/>
      </ProtectRoute>} />

      <Route path = "/admin" element={<AdminLogin/>}/>
      <Route path = "*" element = {<NotFound/>}/>
    </Routes>
    </Suspense>
    <Toaster position='bottom-center'/>
    </BrowserRouter>
  )
}

export default App
