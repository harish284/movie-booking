const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const REGISTER_TABLE = "register";
const MOVIES_TABLE = "movies";
const SHOWS_TABLE = "showtime";
const JWT_SECRET = process.env.JWT_SECRET || "secret123";

const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const userCheck = await dynamoDB.get({
      TableName: REGISTER_TABLE,
      Key: { email }
    }).promise();

    if (userCheck.Item) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: uuidv4(),
      username,
      email,
      password: hashedPassword,
      role
    };

    await dynamoDB.put({
      TableName: REGISTER_TABLE,
      Item: newUser
    }).promise();

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userData = await dynamoDB.get({
      TableName: REGISTER_TABLE,
      Key: { email }
    }).promise();

    const user = userData.Item;
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const addMovie = async (req, res) => {
  const { title, description, language, genre, releaseDate } = req.body;
  const poster = req.file ? `/uploads/${req.file.filename} `: null;

  if (!poster) return res.status(400).json({ message: "Poster image is required." });

  const movie = {
    movieid: uuidv4(),
    title,
    description,
    poster,
    language,
    genre,
    releaseDate
  };

  try {
    await dynamoDB.put({ TableName: MOVIES_TABLE, Item: movie }).promise();
    res.status(201).json({ message: "Movie added", movie });
  } catch (err) {
    res.status(500).json({ message: "Failed to add movie" });
  }
};

const getMovies = async (req, res) => {
  try {
    const result = await dynamoDB.scan({ TableName: MOVIES_TABLE }).promise();
    res.status(200).json(result.Items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch movies" });
  }
};

const deleteMovie = async (req, res) => {
  try {
    await dynamoDB.delete({
      TableName: MOVIES_TABLE,
      Key: { movieid: req.params.id }
    }).promise();
    res.json({ message: "Movie deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting movie" });
  }
};

const createShowtime = async (req, res) => {
  const { movieid,theatre, screen, date, time } = req.body;

  const showtime = {
    movieid: movieid,
    showId: uuidv4(),
    theatre,
    screen,
    date,
    time,
    bookedSeats: []
  };

  try {
    await dynamoDB.put({ TableName: SHOWS_TABLE, Item: showtime }).promise();
    res.status(201).json(showtime);
  } catch (err) {
    res.status(500).json({ message: "Error creating showtime" });
  }
};
const getShowtimesByMovie = async (req, res) => {
  const movieid = req.params.movieid;

  const params = {
    TableName: SHOWS_TABLE,
    KeyConditionExpression: "movieid = :movieid",
    ExpressionAttributeValues: {
      ":movieid": movieid
    }
  };

  try {
    const result = await dynamoDB.query(params).promise();
    res.json(result.Items);
  } catch (err) {
    console.error("Error fetching showtimes:", err);
    res.status(500).json({ message: "Error fetching showtimes" });
  }
};
const bookSeats = async (req, res) => {
  const { movieid, seats, name, email } = req.body;

  if (!movieid) {
    return res.status(400).json({ message: "Movie ID is required" });
  }

  try {
    console.log("Movie ID:", movieid);

    const params = {
      TableName: SHOWS_TABLE,
      FilterExpression: "movieid = :movieid",
      ExpressionAttributeValues: {
        ":movieid": movieid
      }
    };

    const data = await dynamoDB.scan(params).promise();

    if (!data.Items || data.Items.length === 0) {
      return res.status(404).json({ message: "Showtime not found" });
    }

    const showtime = data.Items[0];

    const alreadyBooked = seats.some(seat => showtime.bookedSeats.includes(seat));
    if (alreadyBooked) return res.status(400).json({ message: "Some seats already booked" });

    showtime.bookedSeats.push(...seats);

    await dynamoDB.put({
      TableName: SHOWS_TABLE,
      Item: showtime
    }).promise();

    res.json({ message: `Seats booked for ${name} (${email})`, bookedSeats: showtime.bookedSeats });
  } catch (err) {
    console.error("Error booking seats:", err);
    res.status(500).json({ message: "Error booking seats" });
  }
};


module.exports = {
  registerUser,
  loginUser,
  addMovie,
  getMovies,
  deleteMovie,
  createShowtime,
  getShowtimesByMovie,
  bookSeats
};