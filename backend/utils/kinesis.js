const AWS = require('aws-sdk');


AWS.config.update({ region: 'us-east-1' });
const kinesis=async (streamName,dataObject,customerId)=>
{
    const kinesis = new AWS.Kinesis();

    const dataString = JSON.stringify(dataObject);

    const params = {
        Data: dataString, // The JSON string to send
        PartitionKey: customerId, // Use a relevant partition key
        StreamName: streamName
      };
    kinesis.putRecord(params, (err, data) => {
        if (err) {
          console.error('Error putting record:', err);
        } else {
          console.log('Successfully put record:', data);
        }
    })
};

    
module.exports = {
    kinesis
  };
  
  