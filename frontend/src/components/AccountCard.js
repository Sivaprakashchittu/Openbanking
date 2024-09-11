import React from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';

const AccountCard = ({ name, balance, currency, onClick }) => {
    return (
        <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            p={4}
            boxShadow="md"
            bg="white"
            _hover={{ boxShadow: "lg", cursor: "pointer" }}
            width="300px"  
            height="150px" 
            m={2}
            onClick={onClick}
        >
            <VStack spacing={2} align="stretch" height="100%" justify="center">
                <Text fontSize="xl" fontWeight="bold" textAlign="center">{name}</Text>
                <Text fontSize="md" textAlign="center">Amount: {balance}</Text>
                <Text fontSize="md" textAlign="center">Currency: {currency}</Text>
            </VStack>
        </Box>
    );
};

export default AccountCard;
