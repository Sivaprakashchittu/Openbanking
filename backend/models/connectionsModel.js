const dynamoDB = require('../utils/db');
const TABLE_NAME = 'Connections';


const createConnection = async (connection) => {
    const params = {
      TableName: TABLE_NAME,
      Item: connection,
    };
    return dynamoDB.put(params).promise();
  };
const deleteConnection=async(connectionId,customerId)=>
{
    const params = {
        TableName: TABLE_NAME,
        Key: { 
            connectionId: connectionId, 
            customerId: customerId     
          }
      };
      try {
        await dynamoDB.delete(params).promise();
        console.log(`Deleted connection ${connectionId} from ${TABLE_NAME}`);
      } catch (error) {
        console.error(`Error deleting connection ${connectionId} from ${TABLE_NAME}:`, error);
        throw error;
      }
    
}
  module.exports = {
    createConnection,
    deleteConnection
  };
  