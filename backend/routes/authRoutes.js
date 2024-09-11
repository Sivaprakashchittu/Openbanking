// backend/routes/authRoutes.js
const express = require('express');
const { register, login ,successCallback ,deleteConnections} = require('../controllers/authController');
const {createSaltEdgeConnectSession}=require('../controllers/saltedgeController');
const {transactionbyaccountid}=require('../controllers/transactioncontroller');
const {AccountIdsByCustomerId}=require('../controllers/accountcontroller');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/connect', createSaltEdgeConnectSession);
router.post('/callback',successCallback)
router.post('/delete',deleteConnections)
router.post('/get',transactionbyaccountid)
router.post('/get1',AccountIdsByCustomerId)
module.exports = router;
