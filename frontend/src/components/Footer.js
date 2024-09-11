import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box
      as="footer"
      width="100%"
      bg="gray.800"
      color="white"
      textAlign="center"
      p={4}
      boxShadow="md"
    >
      <Text fontSize="sm">
        &copy; 2024 Open Banking. All rights reserved.
      </Text>
    </Box>
  );
};

export default Footer;
