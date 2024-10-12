import React from 'react';
import { Box, Heading, Text, Button, VStack, Icon } from '@chakra-ui/react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Error: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/'); // Redirect to home page
  };

  return (
    <Box textAlign="center" py={10} px={6}>
      <Icon as={FaExclamationTriangle} boxSize={'50px'} color={'red.500'} />
      <Heading as="h2" size="xl" mt={6} mb={2}>
        Oops! Something went wrong
      </Heading>
      <Text color={'gray.500'}>
        The page you're looking for doesn't exist or an error occurred.
      </Text>
      <VStack mt={6}>
        <Button colorScheme="teal" onClick={handleGoHome}>
          Go to Home
        </Button> 
      </VStack>
    </Box>
  );
};

export default Error;
