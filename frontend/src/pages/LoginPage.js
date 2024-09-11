import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/actions/Useractions';
import FormInput from '../components/FormInput';
import { Box, Button, Flex, Heading, Text, Link } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import Header from '../components/Header'; // Adjust the path as necessary
import Footer from '../components/Footer'; // Adjust the path as necessary

const LoginPage = ({ onRegisterClick }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  useEffect(() => {
    if (user) {
      console.log("user",user)
      navigate('/home'); // Redirect to the homepage
    }
  }, [user, navigate]);

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      {/* Header */}
      <Header />

      {/* Login Form */}
      <Flex flex="1" alignItems="center" justifyContent="center">
        <Box>
          <Box p={8} borderWidth={1} borderRadius="md" boxShadow="md" width="800px">
            <Flex>
              <Box flex="1" p={8} borderRightWidth={1} borderColor="gray.200">
                <Heading as="h2" size="2xl" mb={8}>
                  Welcome to Open Banking
                </Heading>
              </Box>
              <Box flex="1" p={8}>
                <form onSubmit={handleSubmit}>
                  <FormInput
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    fontSize="lg"
                  />
                  <FormInput
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    fontSize="lg"
                  />
                  <Button type="submit" isLoading={loading} width="full" mt={6} size="lg">
                    Login
                  </Button>
                  {error && <Box color="red.500" mt={4}>{error.message}</Box>}
                </form>
                <Text mt={6} fontSize="lg">
                  New User?{' '}
                  <Link color="teal.500" onClick={onRegisterClick}>
                    Register
                  </Link>
                </Text>
              </Box>
            </Flex>
          </Box>
        </Box>
      </Flex>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default LoginPage;
