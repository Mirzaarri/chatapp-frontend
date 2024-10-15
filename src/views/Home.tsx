import React, { useEffect, useState } from 'react';
import { Box, Button, VStack, Text, HStack, Select } from '@chakra-ui/react';
import { useAuth } from '../hooks';
import { useSocket } from '../context/socket.context';
import ChatWindow from './Chat';

interface OnlineUser {
  socketId: string;
  userId: string;
  userName: string;
}
 
const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
];

const Home: React.FC = () => {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<OnlineUser | null>(null); // State to hold the selected user
  const { user } = useAuth();
  const socket = useSocket();
  const [preferredLanguage, setPreferredLanguage] = useState<string>('en'); // Default language

  useEffect(() => {
    if (socket && user?._id) {
      socket.emit('join', { userId: user._id, userName: user.name });

      socket.on('onlineUsers', (users: OnlineUser[]) => {
        // Ensure unique users based on their userId
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

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      setPreferredLanguage(savedLanguage);
    }
  }, []);

  const startChat = (onlineUser: OnlineUser) => {
    setSelectedUser(onlineUser);
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = event.target.value;
    setPreferredLanguage(selectedLanguage);
    localStorage.setItem('preferredLanguage', selectedLanguage); // Save to local storage
  };

  return (
    <Box p={5}>
      <VStack align="start" spacing={4}>
        

        {/* Dropdown for selecting preferred language */}
        {!selectedUser &&  
        <>
        <Text fontSize="2xl" fontWeight="bold">
          Online Users
        </Text>
        <Select
          placeholder="Select language"
          value={preferredLanguage}
          onChange={handleLanguageChange} 
          mb={4}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </Select>
        </>
        }
       

        {selectedUser ? (
          <ChatWindow
            recipientId={selectedUser.userId}
            recipientSocketId={selectedUser.socketId}
            recipientName={selectedUser.userName}
            onClose={() => setSelectedUser(null)}
            preferredLanguage={preferredLanguage} 
          />
        ) : (
          onlineUsers.map((onlineUser) => (
            <HStack key={onlineUser.socketId} justifyContent="space-between" w="100%">
              <Text>{onlineUser.userName}</Text>
              {onlineUser.userId !== user?._id && (
                <Button onClick={() => startChat(onlineUser)} colorScheme="blue">
                  Message
                </Button>
              )}
            </HStack>
          ))
        )}
      </VStack>
    </Box>
  );
};

export default Home;
