const { kinesis } = require('../utils/kinesis');
const AWS = require('aws-sdk');
const axios = require('axios');
const dotenv = require('dotenv');

AWS.config.update({ region: 'us-east-1' });

// Load environment variables
dotenv.config();

const client = new AWS.SecretsManager();
const secretName = 'saltedge_secrets';

let cachedSecrets = null;

// Function to retrieve secrets with caching
const getSecrets = async () => {
  if (cachedSecrets) {
    return cachedSecrets;
  }

  try {
    const data = await client.getSecretValue({ SecretId: secretName }).promise();
    if ('SecretString' in data) {
      cachedSecrets = JSON.parse(data.SecretString);
      return cachedSecrets;
    } else {
      throw new Error('SecretString is missing in the response');
    }
  } catch (err) {
    console.error('Error retrieving secret:', err);
    throw err; // Re-throw the error to handle it outside
  }
};

// Function to create a user account on Salt Edge
const createSaltEdgeAccount = async (user) => {
  try {
    const secrets = await getSecrets();
    const customerData = {
      data: {
        identifier: user, // The unique identifier for the customer
      },
    };

    const response = await axios.post("https://www.saltedge.com/api/v5/customers", customerData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'App-Id': secrets.saltedge_app_id,
        'Secret': secrets.saltedge_secret_id,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error creating Salt Edge account:', error.message);
    throw new Error('Error creating Salt Edge account: ' + error.message);
  }
};

const fetchCustomerConnections = async (customerId, fromId) => {
  try {
    const secrets = await getSecrets();
    const url = `https://www.saltedge.com/api/v5/connections?customer_id=${customerId}&from_id=${fromId}`;

    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'App-id': secrets.saltedge_app_id, 
        'Secret': secrets.saltedge_secret_id,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching customer connections:', error.response ? error.response.data : error.message);
    throw error;
  }
};

const createSaltEdgeConnectSession = async (req, res) => {
  try {
    const secrets = await getSecrets();

    const connectDatas = {
      data: {
        customer_id: "1335368126518270174",
        consent: {
          scopes: ["account_details", "transactions_details"],
          from_date: "2024-01-01"
        },
        attempt: {
          return_to: process.env.FRONTEND_URL,
          javascript_callback_type: "postMessage"
        }
      },
    };

    const response = await axios.post("https://www.saltedge.com/api/v5/connect_sessions/create", connectDatas, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'App-Id': secrets.saltedge_app_id,
        'Secret': secrets.saltedge_secret_id,
      }
    });

    console.log("Response Data:", response.data);

    const connectUrl = response.data.data?.connect_url;
    const expiresAt = response.data.data?.expires_at;

    console.log("Connect URL:", connectUrl);
    console.log("Expires At:", expiresAt);

    res.json(connectUrl);
  } catch (error) {
    console.error('Error creating connect session:', error.message);
    res.status(500).json({ message: 'Error creating connect session' });
  }
};

const fetchAccountDetails = async (connectionId, customerId) => {
  try {
    const secrets = await getSecrets();
    const validNatures = new Set(['account', 'savings', 'checking']);
    const response = await axios.get(
      "https://www.saltedge.com/api/v5/accounts",
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'App-Id': secrets.saltedge_app_id,
          'Secret': secrets.saltedge_secret_id,
        },
        params: {
          connection_id: connectionId
        }
      }
    );

    const accounts = response.data.data;
    const filteredAccounts = accounts.filter(account => validNatures.has(account.nature));

    console.log("Filtered accounts:", filteredAccounts);
    await kinesis("account", filteredAccounts, customerId);
    return filteredAccounts;
  } catch (error) {
    console.error('Error fetching account details:', error);
    throw error;
  }
};

const fetchTransactionDetails = async (connectionId, accountDetails, customerId) => {
  try {
    const secrets = await getSecrets();
    const transactionsPromises = accountDetails.map(async (account) => {
      const response = await axios.get(
        `https://www.saltedge.com/api/v5/transactions`,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'App-Id': secrets.saltedge_app_id,
            'Secret': secrets.saltedge_secret_id,
          },
          params: {
            connection_id: connectionId,
            account_id: account.id // Assuming account_id parameter is needed
          }
        }
      );

      return response.data.data;
    });

    const allTransactions = await Promise.all(transactionsPromises);

    console.log("All transactions processed:", allTransactions);
    await kinesis("transaction", allTransactions, customerId);
    return allTransactions;
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    throw error;
  }
};

module.exports = { createSaltEdgeAccount, fetchCustomerConnections, createSaltEdgeConnectSession, fetchAccountDetails, fetchTransactionDetails };
