const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const SHOWS_TABLE = "shows";

// ✅ Add showtime
const addShowtime = async (movieid, showData) => {
  const showItem = {
    movieid, 
    showId: uuidv4(), 
    ...showData,
    bookedSeats: showData.bookedSeats || [],
    createdAt: new Date().toISOString()
  };

  const params = {
    TableName: SHOWS_TABLE,
    Item: showItem
  };

  await dynamoDB.put(params).promise();
  return showItem;
};

// ✅ Get all showtimes for a movie (by movieid)
const getShowtimesByMovie = async (movieid) => {
  const params = {
    TableName: SHOWS_TABLE,
    KeyConditionExpression: "movieid = :movieid",
    ExpressionAttributeValues: {
      ":movieid": movieid
    }
  };

  const result = await dynamoDB.query(params).promise();
  return result.Items;
};

const bookSeats = async (movieid, showId, newSeats = []) => {
  const params = {
    TableName: SHOWS_TABLE,
    Key: {
      movieid
    
    }
  };

  
  const allShows = await getShowtimesByMovie(movieid);
  const show = allShows.find((item) => item.showId === showId);

  if (!show) throw new Error("Showtime not found");

  
  const updateParams = {
    TableName: SHOWS_TABLE,
    Key: {
      movieid
    },
    UpdateExpression: "SET bookedSeats = list_append(if_not_exists(bookedSeats, :empty), :seats)",
    ExpressionAttributeValues: {
      ":seats": newSeats,
      ":empty": []
    },
    ConditionExpression: "showId = :sid",
    ExpressionAttributeValues: {
      ":sid": showId,
      ":seats": newSeats,
      ":empty": []
    },
    ReturnValues: "UPDATED_NEW"
  };

  const result = await dynamoDB.update(updateParams).promise();
  return result.Attributes;
};

module.exports = {
  addShowtime,
  getShowtimesByMovie,
  bookSeats
};
