import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { useAuth } from '../hooks';

interface ChatMessage {
  userName: string;
  message: string;
}

interface OnlineUser {
  socketId: string;
  userName: string;
}

const socket: Socket = io('http://localhost:3000'); // Ensure the backend server address is correct

const Chat: React.FC = () => {
  const [message, setMessage] = useState<string>(''); // Message input
  const [chat, setChat] = useState<ChatMessage[]>([]); // Chat messages array
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]); // Online users array
  const [userName, setUserName] = useState<string | undefined>(''); // Current user name
  const [receiver, setReceiver] = useState<OnlineUser | null>(null); // Selected user to chat with
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal state to open chatbox
 
  useEffect(() => {
    setUserName(user?.name);
    // Emit user joining the chat
    socket.emit('join', user?.name);

    // Listen for incoming messages
    socket.on('message', (message: ChatMessage) => {
      setChat((prevChat) => [...prevChat, message]);
    });

    // Listen for the list of online users
    socket.on('onlineUsers', (users: OnlineUser[]) => {
      setOnlineUsers(users); // Update the state with online users
    });

    return () => {
      socket.off('message');
      socket.off('onlineUsers');
      socket.disconnect(); // Disconnect socket on component unmount
    };
  }, [userName]);

  // Function to send a message to a specific user
  const sendMessage = () => {
    if (message && receiver) {
      socket.emit('privateMessage', {
        message,
        to: receiver.socketId,
      });
      setMessage(''); // Clear the input after sending the message
    }
  };

  // Handle opening the chat with a specific user
  const startChat = (user: OnlineUser) => {
    setReceiver(user);
    onOpen(); // Open chat modal
  };

  return (
    <Box p={5}>
      <VStack align="start" spacing={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Online Users
        </Text>

        {onlineUsers.map((user) => (
          <HStack key={user.socketId} justifyContent="space-between" w="100%">
            <Text>{user.userName}</Text>
            <Button onClick={() => startChat(user)} colorScheme="blue">
              Message
            </Button>
          </HStack>
        ))}

        {/* Modal for chat */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Chat with {receiver?.userName}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack align="start">
                {/* Display chat messages */}
                {chat.map((msg, index) => (
                  <Box key={index} bg="gray.100" p={3} borderRadius="md" w="100%">
                    <Text><strong>{msg.userName}:</strong> {msg.message}</Text>
                  </Box>
                ))}
                {/* Input to type and send messages */}
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message"
                />
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={sendMessage}>
                Send Message
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

export default Chat;
