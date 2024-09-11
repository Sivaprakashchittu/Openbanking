import React from 'react';
import { Box, IconButton, Collapse, useDisclosure, VStack, Button } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons'; 
import { removeItem } from '../utils/sessionStorageUtil';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const { isOpen, onToggle } = useDisclosure();
    const navigate = useNavigate();

    const handleLogout = () => {
        removeItem('user'); 
        navigate('/');
    };

    return (
        <Box>
            <IconButton
                aria-label="Toggle sidebar"
                icon={<HamburgerIcon />}
                onClick={onToggle}
                position="absolute"
                right="4" 
                top="4"
            />
            <Collapse in={isOpen}>
                <Box p={4} borderWidth={1} borderRadius="md" boxShadow="md" bg="gray.100" position="absolute" right="4" top="14">
                    <VStack spacing={4}>
                        <Button
                            onClick={handleLogout}
                            bg="gray.800" // Dark gray background color
                            color="white" // White text color
                            _hover={{ bg: 'gray.700' }} // Lighter gray on hover
                            size="lg"
                        >
                            Logout
                        </Button>
                        {/* Add other sidebar options here if needed */}
                    </VStack>
                </Box>
            </Collapse>
        </Box>
    );
};

export default Logout;
