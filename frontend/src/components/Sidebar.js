import React from 'react';
import { Box, Button } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { connectToExternalBank } from '../redux/actions/actions'; // Adjust the path as needed
import { getItem } from '../utils/sessionStorageUtil';
const Sidebar = () => {
    const dispatch = useDispatch();

    const handleConnectBank = () => {
        const externaluserid=getItem('user');
        dispatch(connectToExternalBank(externaluserid));
    };

    return (
        <Box 
            position="absolute" 
            top="5" 
            right="20"
        >
            <Button 
                onClick={handleConnectBank} 
                colorScheme="teal" // Changed to teal for a softer appearance that contrasts well with grey
                variant="solid" 
                size="sm" // Reduced size to make the button smaller
                boxShadow="md" // Moderate shadow for emphasis
            >
                Connect to Bank
            </Button>
        </Box>
    );
};

export default Sidebar;
