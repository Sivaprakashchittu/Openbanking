// backend/models/userModel.js
const dynamoDB = require('../utils/db');
const TABLE_NAME = 'Users';

const getUserByEmail = async (email) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { email },
  };
  return dynamoDB.get(params).promise();
};

const createUser = async (user) => {
  const params = {
    TableName: TABLE_NAME,
    Item: user,
  };
  return dynamoDB.put(params).promise();
};

const updateUser = async (email, externalCustomerId) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { email },
    UpdateExpression: 'set externalCustomerId = :externalCustomerId',
    ExpressionAttributeValues: {
      ':externalCustomerId': externalCustomerId,
    },
    ReturnValues: 'UPDATED_NEW'
  };
  return dynamoDB.update(params).promise();
};
module.exports = {
  getUserByEmail,
  createUser,
  updateUser
};
