const dynamoDB = require('../utils/db');
const TABLE_NAME = 'Account';

const getAccountIdsByCustomerId = async (customerId) => {
    const params = {
        TableName: TABLE_NAME,
        FilterExpression: 'customerId = :customerId',
        ExpressionAttributeValues: {
            ':customerId': customerId
        }
    };

    try {
        const data = await dynamoDB.scan(params).promise();
      
        return data.Items; 
    } catch (error) {
        console.error(`Error querying accounts for connection ${connectionId}:`, error);
        throw error;
    }
};
  const deleteAccountsByConnectionId = async (connectionId, accountIds) => {
    try {
      for (const accountId of accountIds) {
        await dynamoDB.delete({
          TableName: TABLE_NAME,
          Key: {
            accountId: accountId, 
            connectionId: connectionId
          }
        }).promise();
        console.log(`Deleted account ${accountId} from ${TABLE_NAME}`);
      }
    } catch (error) {
      console.error(`Error deleting accounts for connection ${connectionId}:`, error);
      throw error;
    }
  };

  module.exports = {
    getAccountIdsByCustomerId,
    deleteAccountsByConnectionId
  };
  