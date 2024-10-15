import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { Box, Input, Button, VStack, Text, HStack } from '@chakra-ui/react';
import { useSocket } from '../context/socket.context'; 
import { useAuth } from '../hooks';
import { getChatHistory } from '../services/chat-service';
import { translateText } from '../services';

interface ChatMessage {
  _id?: string;
  message: string;
  sender: { _id: string; name: string };
  recipient: { _id: string; name: string };
}

interface ChatWindowProps {
  recipientId: string;
  recipientSocketId: string;
  recipientName: string;
  preferredLanguage: string;
  onClose: () => void; 
}

const ChatWindow: React.FC<ChatWindowProps> = ({ recipientId, recipientSocketId, recipientName, onClose, preferredLanguage }) => {
  const socket = useSocket(); 
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState<string>(''); 
  const { user } = useAuth();
  const userName = user?.name; 
  const bottomRef = useRef<HTMLDivElement | null>(null); // Ref for last chat message

  console.log({preferredLanguage})
  
  useEffect(() => {
    const getChats = async () => {
      if (user?._id) {
        const response = await getChatHistory(user._id, recipientId);
        if (response) {
          setChat(response);
        }
      }
    };
    getChats();
  }, [user?._id, recipientId]); 
 
  useEffect(() => {
    if (socket) {
      const handleMessage = async (message: ChatMessage) => {
        const userPreferredLanguage = preferredLanguage;
        const translatedMessage = await translateText(message.message, userPreferredLanguage);
  
        const newMessage = {
          ...message,
          message: translatedMessage, // Use translated message
        };
  
        setChat((prevChat) => [...prevChat, newMessage]);
      };
  
      socket.on('message', handleMessage);
  
      if (user?._id) {
        socket.emit('join', { userId: user._id, userName });
      }
  
      return () => {
        socket.off('message', handleMessage);
      };
    }
  }, [socket, userName, user?._id, preferredLanguage]);

  const sendMessage = useCallback(async () => {
    if (message && socket && user) {
      if (userName) { 
        
        const newMessage: ChatMessage = {
          message,
          sender: { _id: user._id, name: userName },
          recipient: { _id: recipientId, name: recipientName },
        };
  
        setChat((prevChat) => [...prevChat, newMessage]);
        socket.emit('privateMessage', { message, to: recipientSocketId });
        setMessage('');
      }
    }
  }, [message, socket, user, userName, recipientId, recipientSocketId, recipientName]);

  // Scroll to bottom when chat updates
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat]);

  const chatMessages = useMemo(() => (
    chat.map((msg) => (
      <Box
        key={msg?._id}
        bg={msg?.sender?._id === user?._id ? 'blue.400' : 'gray.300'}
        color={msg?.sender?._id === user?._id ? 'white' : 'black'}
        p={3}
        borderRadius="md"
        alignSelf={msg?.sender?._id === user?._id ? 'flex-end' : 'flex-start'}
        maxW="70%"
        boxShadow="md"
      >
        <Text textAlign={msg?.sender?._id === user?._id ? 'right' : 'left'}>
          <strong>{msg?.sender?.name}:</strong> {msg?.message}
        </Text>
      </Box>
    ))
  ), [chat, user?._id]);

  return (
    <Box p={6} w="100%" h="100vh" display="flex" flexDirection="column">
      <VStack align="stretch" spacing={4} w="100%" h="100%">
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">
          Chat with {recipientName || 'User'}
        </Text>

        {/* Chat messages display */}
        <VStack
          align="flex-start"
          spacing={2}
          w="100%"
          bg="gray.100"
          p={4}
          borderRadius="md"
          h="100%"
          overflowY="auto"
          boxShadow="lg"
        >
          {chatMessages}
          <div ref={bottomRef} /> {/* Dummy div for scrolling to bottom */}
        </VStack>

        {/* Message input */}
        <HStack w="100%" spacing={4}>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message"
            size="lg"
            flex="1"
            bg="white"
            boxShadow="sm"
            borderRadius="md"
          />
          <Button
            onClick={sendMessage}
            colorScheme="blue"
            size="lg"
            boxShadow="md"
          >
            Send
          </Button>
        </HStack>

        <Button onClick={onClose} colorScheme="red" mt={4} alignSelf="center">
          Close Chat
        </Button>
      </VStack>
    </Box>
  );
};

export default ChatWindow;
