import AWS from 'aws-sdk';
const { Kinesis, DynamoDB } = AWS;

const dynamoDb = new DynamoDB.DocumentClient();
const TABLE_NAME = 'Transaction'; // Replace with your DynamoDB table name

export const handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    // Iterate over each record in the event
    for (const record of event.Records) {
        // Decode the Kinesis data from base64
        const payload = Buffer.from(record.kinesis.data, 'base64').toString('utf-8');
        
        // Parse the payload
        let transactionArrays;
        try {
            transactionArrays = JSON.parse(payload);
        } catch (error) {
            console.error('Error parsing JSON:', error);
            continue;
        }

        // Flatten the array of arrays and map to the desired format
        const transactions = transactionArrays.flat().map(transaction => ({
            transactionId: transaction.id,
            accountId: transaction.account_id,
            amount: transaction.amount,
            description: transaction.description
        }));

        console.log('Filtered transactions:', JSON.stringify(transactions, null, 2));

        // Store each transaction in DynamoDB
        for (const transaction of transactions) {
            const params = {
                TableName: TABLE_NAME,
                Item: {
                    transactionId: transaction.transactionId,
                    accountId: transaction.accountId,
                    amount: transaction.amount,
                    description: transaction.description
                }
            };

            try {
                await dynamoDb.put(params).promise();
                console.log(`Transaction ${transaction.transactionId} stored successfully.`);
            } catch (error) {
                console.error('Error storing transaction in DynamoDB:', error);
            }
        }
    }

    return `Successfully processed ${event.Records.length} records.`;
};
