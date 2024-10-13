import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// Create the context
const SocketContext = createContext<Socket | null>(null);
 
export const useSocket = () => useContext(SocketContext);

// Create a provider component
export const SocketProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io('http://localhost:3000');
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
