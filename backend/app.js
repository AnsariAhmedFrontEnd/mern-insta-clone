require('dotenv').config();
const express = require("express");
const app = express();
const port = process.env.port || 5000;
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

app.use(cors());
require("./models/model");
require("./models/post");
app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/createPost"));
app.use(require("./routes/user"));

mongoose.connect(process.env.mongoUrl);

mongoose.connection.on("connected", () => {
  console.log("succefully connected to mongoDB");
});

mongoose.connection.on("error", () => {
  console.log("NOT connected to mongoDB");
});

//To serve frontend

app.use(express.static(path.join(__dirname, "./frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "./frontend/build/index.html"),
    function (err) {
      res.status(500).send(err);
    }
  );
});

app.listen(port, () => {
  console.log("server is runnign on " + port);
});
