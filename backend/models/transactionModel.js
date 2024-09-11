const dynamoDB = require('../utils/db');
const TABLE_NAME = 'Transaction';
const getTransactionIdsByAccountId = async (accountId) => {
    const params = {
        TableName: TABLE_NAME,
        FilterExpression: 'accountId = :accountId',
        ExpressionAttributeValues: {
            ':accountId': accountId
        }
    };

    try {
        const data = await dynamoDB.scan(params).promise();
        return data.Items;
    } catch (error) {
        console.error(`Error querying transactions for account ${accountId}:`, error);
        throw error;
    }
};

// Function to delete transactions by account IDs
const deleteTransactionsByAccountIds = async (accountIds) => {
    try {
        for (const accountId of accountIds) {
            const transactionIds = await getTransactionIdsByAccountId(accountId);

            for (const transactionId of transactionIds) {
                await dynamoDB.delete({
                    TableName: TABLE_NAME,
                    Key: {
                        transactionId: transactionId,
                        accountId: accountId
                    }
                }).promise();
                console.log(`Deleted transaction ${transactionId} from ${TABLE_NAME}`);
            }
        }
    } catch (error) {
        console.error('Error deleting transactions:', error);
        throw error;
    }
};

module.exports = {
    getTransactionIdsByAccountId,
    deleteTransactionsByAccountIds
};

