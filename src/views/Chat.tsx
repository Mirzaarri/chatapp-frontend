import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Box, Input, Button, VStack, Text, HStack } from '@chakra-ui/react';
import { useSocket } from '../context/socket.context'; 
import { useAuth } from '../hooks';
import { getChatHistory } from '../services/chat-service';
import { translateMessage } from '../services';

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
        // Translate the message to the user's preferred language
        const userPreferredLanguage = preferredLanguage;
        const translatedMessage = await translateMessage(message.message, userPreferredLanguage);
  
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
  }, [socket, userName, user?._id]);

  const sendMessage = useCallback(async () => {
    if (message && socket && user) {
      if (userName) {
        // Translate the message to the recipient's preferred language
        const recipientLanguage = 'es';
        const translatedMessage = await translateMessage(message, recipientLanguage);
  
        const newMessage: ChatMessage = {
          message: translatedMessage, // Use translated message
          sender: { _id: user._id, name: userName },
          recipient: { _id: recipientId, name: recipientName },
        };
  
        setChat((prevChat) => [...prevChat, newMessage]);
        socket.emit('privateMessage', { message: translatedMessage, to: recipientSocketId });
        setMessage('');
      }
    }
  }, [message, socket, user, userName, recipientId, recipientSocketId]);

  const chatMessages = useMemo(() => (
    chat.map((msg) => (
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
    ))
  ), [chat, user?._id]);

  return (
    <Box p={5}>
      <VStack align="start" spacing={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Chat with {recipientName || 'User'}
        </Text>

        {/* Chat messages display */}
        <VStack align="start" spacing={2} w="100%" bg="gray.100" p={3} borderRadius="md" h="400px" overflowY="scroll">
          {chatMessages}
        </VStack>

        {/* Message input */}
        <HStack w="100%">
          <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message" flex="1" />
          <Button onClick={sendMessage} colorScheme="blue">
            Send
          </Button>
        </HStack>

        <Button onClick={onClose} colorScheme="red" mt={4}>
          Close Chat
        </Button>
      </VStack>
    </Box>
  );
};

export default ChatWindow;
