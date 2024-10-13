import React, { useEffect, useState } from 'react';
import { Box, Input, Button, VStack, Text, HStack } from '@chakra-ui/react';
import { useLocation, useParams } from 'react-router-dom';
import { useSocket } from '../context/socket.context'; // Use the socket context
import { useAuth } from '../hooks';

interface ChatMessage {
  userName: string;
  message: string;
}
const ChatWindow: React.FC = () => {
  const { userId } = useParams(); // Get the userId (which is the socketId) from route parameters
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const recipientFromParams = queryParams.get('userName'); // Get the recipient's name from URL params

  const socket = useSocket(); // Use the existing socket instance
  const [chat, setChat] = useState<ChatMessage[]>([]); // Chat messages array
  const [message, setMessage] = useState<string>(''); // Message input
  const { user } = useAuth();
  const userName = user?.name; // Get the current user's name
  const [recipientName, setRecipientName] = useState<string>(recipientFromParams || ''); // Set recipient's name from params

  useEffect(() => {
    if (socket && recipientName) {
      // Listen for incoming messages
      socket.on('message', (message: ChatMessage) => {
        setChat((prevChat) => [...prevChat, message]);
      });

      // Emit a "join" event to fetch and show the recipient's name when the chat starts
      socket.emit('join', userName);
    }

    return () => {
      if (socket) {
        socket.off('message');
      }
    };
  }, [socket, userName, recipientName]);

  const sendMessage = () => {
    if (message && socket) {
      if (userName) {
        const newMessage = { userName, message }; // Your message object
        setChat((prevChat) => [...prevChat, newMessage]); // Add your message to the chat array
        socket.emit('privateMessage', { message, to: userId }); // Send the message to the other user
        setMessage(''); // Clear the input after sending the message
      }
    }
  };

  return (
    <Box p={5}>
      <VStack align="start" spacing={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Chat with {recipientName || 'User'} {/* Show the recipient's name, fallback to 'User' if not available */}
        </Text>

        {/* Chat messages display */}
        <VStack align="start" spacing={2} w="100%" bg="gray.100" p={3} borderRadius="md" h="400px" overflowY="scroll">
          {chat.map((msg, index) => (
            <Box key={index} bg={msg.userName === userName ? 'blue.100' : 'gray.200'} p={3} borderRadius="md" alignSelf={msg.userName === userName ? 'flex-start' : 'flex-end'} maxW="70%">
              <Text textAlign={msg.userName === userName ? 'left' : 'right'}>
                <strong>{msg.userName}:</strong> {msg.message}
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