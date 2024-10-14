import React, { useEffect, useState } from 'react';
import { Box, Button, VStack, Text, HStack } from '@chakra-ui/react';
import { useAuth } from '../hooks';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/socket.context';

interface OnlineUser {
  socketId: string;
  userId: string;
  userName: string;
}

const Home: React.FC = () => { 
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const { user } = useAuth();
  const socket = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (socket && user?._id) {
      socket.emit('join', { userId: user._id, userName: user.name });

      socket.on('onlineUsers', (users: OnlineUser[]) => {
        console.log('checking online users', users);

        // Use a Map to ensure unique users based on their userId
        const uniqueUsers = Array.from(
          new Map(users.map((u) => [u.userId, u])).values()
        );

        setOnlineUsers(uniqueUsers);
      });
    }

    return () => {
      if (socket) {
        socket.off('onlineUsers');
      }
    };
  }, [socket, user]);

  const startChat = (recipientId: string, recipientSocketId: string, userName: string) => {
    navigate(
      `/chat/${recipientId}?userName=${encodeURIComponent(userName)}&recipientSocketId=${encodeURIComponent(recipientSocketId)}`
    );
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
            {onlineUser.userId !== user?._id && (
              <Button onClick={() => startChat(onlineUser.userId, onlineUser.socketId, onlineUser.userName)} colorScheme="blue">
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
