import React, { useEffect, useState } from 'react';
import { Box, Input, Button, VStack, Text, HStack } from '@chakra-ui/react';
import { useLocation, useParams } from 'react-router-dom';
import { useSocket } from '../context/socket.context'; 
import { useAuth } from '../hooks';
import { getChatHistory } from '../services/chat-service';

interface ChatMessage {
  _id?: string;
  message: string;
  sender: { _id: string; name: string };
  recipient: { _id: string; name: string };
}

const ChatWindow: React.FC = () => {
  const { userId } = useParams(); 
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const recipientSocketId = queryParams.get('recipientSocketId'); 
  const recipientName = queryParams.get('userName'); 

  const socket = useSocket(); 
  const [chat, setChat] = useState<ChatMessage[]>([]); // Chat messages array
  const [message, setMessage] = useState<string>(''); // Message input
  const { user } = useAuth();
  const userName = user?.name; 

  useEffect(() => {
    const getChats = async () => {
      if (user?._id && userId) {
        const response = await getChatHistory(user._id, userId);
        if (response) {
          setChat(response);
        }
      }
    };
    getChats();
  }, [user?._id, userId]);

  useEffect(() => {
    if (socket) {
      socket.on('message', (message: ChatMessage) => {
        setChat((prevChat) => [...prevChat, message]);
      });

      if (user?._id) {
        socket.emit('join', { userId: user._id, userName });
      }
    }

    return () => {
      if (socket) {
        socket.off('message');
      }
    };
  }, [socket, userName, user?._id]);

  const sendMessage = () => {
    if (message && socket && user) { // Ensure user is defined
      if (userName && userId && recipientName) {
        const newMessage: ChatMessage = {
          message,
          sender: { _id: user._id, name: userName },
          recipient: { _id: userId, name: recipientName },
        };

        // Update the chat state with the new message
        setChat((prevChat) => [...prevChat, newMessage]); 
        
        // Emit the message to the recipient
        socket.emit('privateMessage', { message, to: recipientSocketId });
        
        // Clear the message input
        setMessage(''); 
    }
  }
  }

  return (
    <Box p={5}>
      <VStack align="start" spacing={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Chat with {recipientName || 'User'}
        </Text>

        {/* Chat messages display */}
        <VStack align="start" spacing={2} w="100%" bg="gray.100" p={3} borderRadius="md" h="400px" overflowY="scroll">
          {user && chat?.map((msg) => (
            <Box
              key={msg?._id}
              bg={msg?.sender?._id === user?._id ? 'blue.100' : 'gray.200'}
              p={3}
              borderRadius="md"
              alignSelf={msg?.sender?._id === user?._id ? 'flex-start' : 'flex-end'}
              maxW="70%"
            >
              <Text textAlign={msg?.sender?._id === user?._id ? 'left' : 'right'}>
                <strong>{msg?.sender?.name}:</strong> {msg?.message}
              </Text>
            </Box>
          ))}
        </VStack>

        {/* Message input */}
        <HStack w="100%">
          <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message" flex="1" />
          <Button onClick={sendMessage} colorScheme="blue">
            Send
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default ChatWindow;