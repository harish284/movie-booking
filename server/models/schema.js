const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "Users";

// Register a new user
const registerUser = async (userData) => {
  const userId = uuidv4();

  const item = {
    userId,
    username: userData.username,
    email: userData.email,
    password: userData.password,
    role: userData.role,
    createdAt: new Date().toISOString()
  };

  const params = {
    TableName: TABLE_NAME,
    Item: item
  };

  await dynamoDB.put(params).promise();
  return item;
};

// Get user by email
const getUserByEmail = async (email) => {
  const params = {
    TableName: TABLE_NAME,
    IndexName: "email-index", // assuming a GSI on email
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": email
    }
  };

  const result = await dynamoDB.query(params).promise();
  return result.Items[0]; // assuming email is unique
};

module.exports = {
  registerUser,
  getUserByEmail
};
