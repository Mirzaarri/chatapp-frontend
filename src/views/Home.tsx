import React, { useEffect, useState } from 'react';
import { Box, Button, VStack, Text, HStack } from '@chakra-ui/react';
import { useAuth } from '../hooks';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/socket.context';

interface OnlineUser {
  socketId: string;
  userName: string;
}

const Home: React.FC = () => {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const { user } = useAuth();
  const socket = useSocket(); // Access the socket instance
  const navigate = useNavigate();

  useEffect(() => {
    if (socket && user?.name) {
      // Emit join event only once on initial load
      socket.emit('join', user.name);

      // Listen for updated online users list
      socket.on('onlineUsers', (users: OnlineUser[]) => {
        // Filter out duplicate users by their socketId using a Set
        const uniqueUsers = Array.from(new Set(users.map((u) => u.socketId)))
          .map((socketId) => users.find((user) => user.socketId === socketId)!);

        setOnlineUsers(uniqueUsers); // Update state with unique users
      });
    }

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.off('onlineUsers');
      }
    };
  }, [socket, user]);

  const startChat = (userId: string, userName: string) => {
    // Pass both userId (socketId) and userName to the chat window
    navigate(`/chat/${userId}?userName=${encodeURIComponent(userName)}`);
  };

  return (
    <Box p={5}>
      <VStack align="start" spacing={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Online Users
        </Text>

        {onlineUsers.map((onlineUser) => (
          <HStack key={onlineUser.socketId} justifyContent="space-between" w="100%">
            <Text>{onlineUser.userName}</Text>
            {onlineUser.userName !== user?.name && (
              <Button onClick={() => startChat(onlineUser.socketId, onlineUser.userName)} colorScheme="blue">
                Message
              </Button>
            )}
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};

export default Home;
