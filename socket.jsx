/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useMemo } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { io } from "socket.io-client";
import { server } from "./src/constants/config";



const SocketContext = createContext();

const getSocket = () => useContext(SocketContext);

// eslint-disable-next-line react-refresh/only-export-components
const SocketProvider = ({children})=>{
    
    const socket = useMemo(()=> io(server, {withCredentials:true}), [])

    return (
        <SocketContext.Provider value={socket}>
            {children}
         </SocketContext.Provider>
    )
}


export {SocketProvider, getSocket};