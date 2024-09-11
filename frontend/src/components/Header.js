import React from 'react';
import { Box, Heading, Flex } from '@chakra-ui/react';
const Header = ( loggedIn ) => {
 
    return (
        <Box as="header" width="100%" bg="gray.800" p={4} color="white" boxShadow="md">
            <Flex alignItems="center" justifyContent="space-between">
               
                {/* Heading centered */}
                <Box flex="1" textAlign="center">
                    <Heading as="h1" size="lg">
                        Open Banking
                    </Heading>
                </Box>
             
            </Flex>
            
        </Box>
    );
};

export default Header;
