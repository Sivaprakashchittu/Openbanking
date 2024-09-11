import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ChakraProvider, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import store from './redux/store';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import AccountDetails from './pages/AccountDetails';

const App = () => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const openRegister = () => setIsRegisterOpen(true);
  const closeRegister = () => setIsRegisterOpen(false);

  return (
    <Provider store={store}>
      <ChakraProvider>
        <Router>
          <Routes>
            
            <Route path="/" element={<LoginPage onRegisterClick={openRegister} />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/account/:id" element={<AccountDetails />} />
          </Routes>
          <Modal isOpen={isRegisterOpen} onClose={closeRegister}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Register</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <RegisterPage onClose={closeRegister} />
              </ModalBody>
            </ModalContent>
          </Modal>
        </Router>
      </ChakraProvider>
    </Provider>
  );
};

export default App;
