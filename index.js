require('dotenv').config()
console.log(process.env) // remove this after you've confirmed it is working
console.log("======================================")
console.log(process.env.MONGODB_URI)
console.log("======================================")

const express = require("express");
const cors = require("cors");
const connectDB = require('./config/db');
const app = express();
const authRoutes = require("./routes/authRoutes");
const privateRoutes = require("./routes/privateRoutes");
const cookieParser = require("cookie-parser");


app.listen(4000, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server Started Successfully.");
  }
});

connectDB();

app.use(
    cors({
      origin: ["http://localhost:3000"],
      methods: ["GET", "POST"],
      credentials: true,
    })
  );

  app.use(cookieParser());

app.use(express.json());
app.use("/", authRoutes);
app.use("/api/private", privateRoutes);