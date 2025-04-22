const express = require("express");
const AWS = require("aws-sdk");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/authroute");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

AWS.config.update({
  region: "us-east-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const testDynamoDBConnection = async () => {
  try {
    // Test register table
    const registerParams = {
      TableName: "register",
      Key: { email: "test@example.com" }
    };
    const registerResult = await dynamoDB.get(registerParams).promise();
    console.log(" DynamoDB - register table connected", registerResult);

    // Test movies table
    const moviesParams = {
      TableName: "movies",
      Key: { movieid: "movie123" }
    };
    const moviesResult = await dynamoDB.get(moviesParams).promise();
    console.log("DynamoDB - movies table connected", moviesResult);

    // Test showtime table
    const showtimesParams = {
      TableName: "showtime",
      Key: {
        movieid: "movie123"
      }
    };
    const showtimesResult = await dynamoDB.get(showtimesParams).promise();
    console.log("DynamoDB - showtime table connected", showtimesResult);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("DynamoDB connection error:", error);
  }
};

testDynamoDBConnection();