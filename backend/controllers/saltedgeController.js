const AWS = require('aws-sdk');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();


AWS.config.update({ region: 'us-east-1' });
const client = new AWS.SecretsManager();
const secretName = 'saltedge_secrets';


// Function to retrieve secrets with caching and lazy loading
const getSecrets = async () => {

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

const createSaltEdgeConnectSession = async (req, res) => {
  try {
    const secrets = await getSecrets();
    console.log("heheh",secrets.saltedge_app_id)
    console.log("heheh1",secrets.saltedge_secret_id)
    const connectDatas = {
      data: {
        customer_id: req.body.id,
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

module.exports = { createSaltEdgeConnectSession };
