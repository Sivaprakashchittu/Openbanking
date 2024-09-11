import pkg from 'aws-sdk';
const { Kinesis, DynamoDB } = pkg;

const dynamoDb = new DynamoDB.DocumentClient();

export const handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    
    // Define valid nature types
    const validNatures = new Set(['account', 'savings', 'checking']);
    
    // Iterate over each record in the event
    for (const record of event.Records) {
        // Extract customerId from the partition key
        const customerId = record.kinesis.partitionKey;

        // Decode the Kinesis data from base64
        const payload = Buffer.from(record.kinesis.data, 'base64').toString('utf-8');
        const data = JSON.parse(payload);

        // Process each record in the payload
        for (const item of data) {
            if (validNatures.has(item.nature)) {
                // Extract required attributes
                const { id, connection_id, name, balance, currency_code } = item;
                
                // Define the DynamoDB item
                const dbItem = {
                    TableName: 'Account',
                    Item: {
                        accountId: id,
                        connectionId: connection_id,
                        name: name,
                        balance: balance,
                        currency: currency_code,
                        customerId: customerId // Add customerId to the item
                    }
                };

                try {
                    // Store item in DynamoDB
                    await dynamoDb.put(dbItem).promise();
                    console.log(`Successfully stored record with id: ${id}`);
                } catch (error) {
                    console.error(`Error storing record with id: ${id}`, error);
                }
            }
        }
    }

    return `Successfully processed ${event.Records.length} records.`;
};
