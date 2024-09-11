import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Spinner, Stack, Heading, Flex } from '@chakra-ui/react';
import Header from '../components/Header'; // Adjust the path as necessary
import Footer from '../components/Footer'; // Adjust the path as necessary
import Sidebar from '../components/Sidebar'; // Adjust the path as necessary
import AccountCard from '../components/AccountCard';
import Logout from '../components/Logout';
import { getItem } from '../utils/sessionStorageUtil';
import axios from 'axios';

axios.defaults.baseURL =process.env.REACT_APP_SERVER_DOMAIN;
const HomePage = () => {
    const { loading, error, user } = useSelector((state) => state.auth);
    const [accounts, setAccounts] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        // Fetch accounts data
        const fetchAccounts = async () => {
            try {
                const response = await axios.post(`/api/auth/get1`, {
                    id: getItem('user')
                });
                setAccounts(response.data.message); // Adjust based on the actual response structure
            } catch (error) {
                console.error('Failed to fetch accounts', error);
            }
        };
        fetchAccounts();
    }, []);

    const handleCardClick = (account) => {
        // Handle card click, e.g., navigate to account details page
       
        navigate(`/account/${account.accountId}`, { state: { account } });
    };

    return (
        <Box minHeight="100vh" display="flex" flexDirection="column">
            {/* Header */}
            <Header  />

            {/* Sidebar */}
            <Sidebar />
            <Logout/>
            <Flex
                flex="1"
                align="center"
                justify="center"
                bg="gray.100"
                p={4}
            >
                <Box w="full" maxW="1200px" textAlign="center">
                    {loading && <Spinner />}
                    {error && <Box color="red.500">{error}</Box>}
                    {!loading && !error && (
                        <>
                            <Heading as="h1" mb={4}>Accounts</Heading>
                            <Stack direction="column" spacing={4} align="center">
                                {accounts.map((account) => (
                                    <AccountCard
                                        key={account.accountId}
                                        name={account.name}
                                        balance={account.balance}
                                        currency={account.currency}
                                        onClick={() => handleCardClick(account)}
                                    />
                                ))}
                            </Stack>
                        </>
                    )}
                </Box>
            </Flex>
 
            {/* Footer */}
            <Footer />
        </Box>
    );
};

export default HomePage;
