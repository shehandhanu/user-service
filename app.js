const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

//Set Cors
app.use(
  cors({
    origin: "https://blackcode-carrentalsystem-fron.herokuapp.com",
    credentials: true,
  })
);

//Import Routes
const user = require("./routes/User.Routes");

//use Routes
app.use("/api/v1/user", user);

module.exports = app;
