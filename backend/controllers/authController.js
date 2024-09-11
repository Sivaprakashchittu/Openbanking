// backend/controllers/authController.js
const { getUserByEmail, createUser,updateUser } = require('../models/userModel');
const {createConnection,deleteConnection}=require("../models/connectionsModel")
const { getAccountIdsByConnectionId, deleteAccountsByConnectionId }=require("../models/accountModel"); 
const { deleteTransactionsByAccountIds } =require("../models/transactionModel"); 
const { encryptPassword, comparePassword } = require('../utils/encryptPassword');
const { validateRegisterInput } = require('../utils/validateInput');
const { createSaltEdgeAccount,fetchCustomerConnections,fetchAccountDetails,fetchTransactionDetails } = require('../utils/saltEdgeUtils');

const register = async (req, res) => {
  try {
    const { username, password, confirmPassword, email } = req.body;
    validateRegisterInput(username, password, confirmPassword, email);

    const existingUser = await getUserByEmail(email);
    if (existingUser.Item) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await encryptPassword(password);
    await createUser({ username, password: hashedPassword, email });
   const response=await createSaltEdgeAccount(email);
   const externalCustomerId = response.data.id
   await updateUser(email, externalCustomerId);
   console.log("external customer id",response.data.id);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await getUserByEmail(username);
    const externalCustomerId=user.Item.externalCustomerId

    if (!user.Item || !(await comparePassword(password, user.Item.password))) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
  
    res.status(200).json({ id: externalCustomerId});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const successCallback=async(req,res)=>
{
  console.log('Full request received:', req.body);
  console.log('Request headers:', req.headers); 

  
  const connectionId = req.body.data.connection_id;
  const customerId=req.body.data.customer_id;
  if(req.body.data.stage==='finish')
  { 
  const response=await fetchCustomerConnections(customerId,connectionId);
  console.log("respone",response.data);
  const fetch=response.data[0];
  const bankName=fetch.provider_name;
  const status=fetch.status;
  const country=fetch.country_code
  await createConnection({ connectionId, customerId, bankName,status,country });
  const accountdetails= await fetchAccountDetails(connectionId,customerId);
  await fetchTransactionDetails(connectionId,accountdetails,customerId)

  }

  if (!connectionId) {
    return res.status(400).send('Missing connection_id');
  }

  console.log(`Connection ID: ${connectionId}`);
}

const deleteConnections=async(req,res)=>
{
  const connectionId=req.body.id;
  const customer_id=req.body.cusid;
  console.log("tell",connectionId)
  
  try {
    // Step 1: Delete from connections table
    await deleteConnection(connectionId,customer_id);

    // Step 2: Fetch and delete from accounts table
    const accountIds = await getAccountIdsByConnectionId(connectionId);
    await deleteAccountsByConnectionId(connectionId, accountIds);

    // Step 3: Fetch and delete from transactions table
    await deleteTransactionsByAccountIds(accountIds);

  console.log("scuccesfull done");
  } catch (error) {
    console.error('Error deleting connection and related data:', error);

  }
}
module.exports = {
  register,
  login,
  successCallback,
  deleteConnections
};
