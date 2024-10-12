// src/components/AuthComponent.tsx
import React, { useEffect, useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Stack, Text, Heading, Alert, AlertIcon } from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
 
export const AuthComponent = () => {
  const { user, error, loading, signupUser, loginUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      const response = await loginUser({ email, password });
      if(response){
        navigate('/');
      }
    } else {
      const response = await signupUser({ name, email, password });
      if(response){
        navigate('/'); // Redirect to home
      }
    } 
  };

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    const storedToken = sessionStorage.getItem('token');
    if(storedUser && storedToken) {
      navigate('/');
    }

  }, []);
  return (
    <Box
      maxW="md"
      mx="auto"
      mt={10}
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
    >
      <Heading as="h2" size="lg" textAlign="center" mb={6}>
        {isLogin ? 'Login' : 'Signup'}
      </Heading>

      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          {!isLogin && (
            <FormControl id="name" isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
          )}

          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>

          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            isLoading={loading}
            loadingText={isLogin ? 'Logging in...' : 'Signing up...'}
          >
            {isLogin ? 'Login' : 'Signup'}
          </Button>
        </Stack>
      </form>

      <Text mt={4} textAlign="center" onClick={() => setIsLogin(!isLogin)} cursor="pointer" color="blue.500">
        {isLogin ? 'Switch to Signup' : 'Switch to Login'}
      </Text>

      {error && (
        <Alert status="error" mt={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      {user && (
        <Alert status="success" mt={4}>
          <AlertIcon />
          Welcome, {user.name}!
        </Alert>
      )}
    </Box>
  );
};
