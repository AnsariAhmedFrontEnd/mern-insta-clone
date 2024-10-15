require('dotenv').config();
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const USER = mongoose.model("USER");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const requireLogin = require("../middlewares/requireLogin");

router.post("/signup", (req, res) => {
  const { name, userName, email, password } = req.body;

  if (!name || !userName || !email || !password) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  USER.findOne({ $or: [{ email: email }, { userName: userName }] })
    .then((savedUser) => {
      if (savedUser) {
        return res
          .status(422)
          .json({ error: "User already exists with that email or username" });
      }
      bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new USER({
          name,
          userName,
          email,
          password: hashedPassword,
        });
        user
          .save()
          .then((user) => {
            res.json({ message: "Registered successfully" });
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "Internal Server Error" });
          });
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: "Please enter email and password" });
  }

  USER.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "User Not found with this email" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((match) => {
        if (match) {
          // return res.status(200).json({ message: "Signed in Successfully" });
          const token = jwt.sign({ _id: savedUser.id }, process.env.jwt_secret);
          const { _id, name, userName, email } = savedUser;
          res.json({ token, user: { _id, name, userName, email } });
          console.log({ token, user: { _id, name, userName, email } });
        } else {
          res.status(422).json({ error: "Invalid Password" });
        }
      })
      .catch((err) => console.log(err));
  });
});

router.post("/googleLogin", (req, res) => {
  const { email_verified, email, name, clientId, picture,userName } = req.body;
  if (email_verified) {
    USER.findOne({ email: email }).then((savedUser) => {
      if (savedUser) {
        const token = jwt.sign({ _id: savedUser.id }, process.env.jwt_secret);
        const { _id, name, userName, email } = savedUser;
        res.json({ token, user: { _id, name, userName, email } });
        console.log({ token, user: { _id, name, userName, email } });
      } else {
        const password = email + clientId;
        const user = new USER({
          name,
          userName,
          email,
          password: password,
          picture,
        });
        user
          .save()
          .then((user) => {
            let userId = user._id.toString();
            const token = jwt.sign({ _id: userId }, process.env.jwt_secret);
            const { _id, name, userName, email } = user;
            res.json({ token, user: { _id, name, userName, email } });
            console.log({ token, user: { _id, name, userName, email } });
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "Internal Server Error" });
          });
      }
    });
  }
});
module.exports = router;
