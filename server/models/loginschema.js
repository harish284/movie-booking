const AWS = require("aws-sdk");

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = "login"; // Replace with your DynamoDB table name

// Save user to DynamoDB
const saveUser = async (email, password) => {
  const params = {
    TableName: TABLE_NAME,
    Item: {
      email,
      password
    }
  };

  return dynamoDB.put(params).promise();
};

// Get user by email from DynamoDB
const getUserByEmail = async (email) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      email
    }
  };

  const result = await dynamoDB.get(params).promise();
  return result.Item;
};

module.exports = {
  saveUser,
  getUserByEmail
};
