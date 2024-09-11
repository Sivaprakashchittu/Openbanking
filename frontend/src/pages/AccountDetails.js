import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Box, Heading, Text, Stack, Spinner, Divider, Flex, Badge } from '@chakra-ui/react';
import axios from 'axios';
import Header from '../components/Header'; 
import Footer from '../components/Footer'; 

axios.defaults.baseURL =process.env.REACT_APP_SERVER_DOMAIN;
const AccountDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const { account } = location.state;

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.post(`/api/auth/get`, {
                    id: id
                });
                setTransactions(response.data.message); 
                setLoading(false);
            } catch (error) {
                setError('Failed to load transactions');
                setLoading(false);
            }
        };
        fetchTransactions();
    }, [id]);

    return (

        <Box  >
            <Header/>
            <Heading as="h1" mb={6} textAlign="center">Account Details</Heading>
       
            {account && (
                <Box
                    mb={8}
                    p={6}
                    boxShadow="md"
                    borderRadius="md"
                    bg="white"
                >
                    <Heading as="h2" size="lg" mb={4}>
                        {account.name} <Badge ml={2} colorScheme="green">{account.currency}</Badge>
                    </Heading>
                    <Flex justifyContent="space-between" alignItems="center" mb={4}>
                        <Text fontSize="xl" fontWeight="bold">
                            Balance: {account.balance} {account.currency}
                        </Text>
                        <Text fontSize="md" color="gray.500">
                            Account ID: {account.accountId}
                        </Text>
                    </Flex>
                    <Divider />
                    <Text mt={4}>
                        <strong>Customer ID:</strong> {account.customerId}
                    </Text>
                    <Text mt={2}>
                        <strong>Connection ID:</strong> {account.connectionId}
                    </Text>
                </Box>
            )}
      
            <Heading as="h2" size="lg" mb={4}>Transactions</Heading>
            {loading ? (
                <Spinner />
            ) : error ? (
                <Box color="red.500">{error}</Box>
            ) : (
                <Stack spacing={4}>
                    {transactions.map((transaction) => (
                        <Box
                            key={transaction.transactionId}
                            p={4}
                            boxShadow="sm"
                            borderRadius="md"
                            bg="white"
                            _hover={{ boxShadow: "md" }}
                        >
                            <Text fontSize="md" color="gray.600">
                                {transaction.description}
                            </Text>
                            <Text fontSize="lg" fontWeight="bold">
                                Amount: {transaction.amount}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                                Transaction ID: {transaction.transactionId}
                            </Text>
                        </Box>
                    ))}
                </Stack>
            )}
            <Footer/>
        </Box>
    );
};

export default AccountDetails;
