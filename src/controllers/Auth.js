var express = require("express");
const bcrypt = require("bcryptjs");
var router = express.Router();
const Validator = require("fastest-validator");
const jwt = require("jsonwebtoken");
const val_ = new Validator();
const { Users } = require("../models");
const CryptoEncrypt = require("../utils/crypto");
const { registerValidation, loginValidation } = require("../validation/Auth");

// POST Register
exports.postRegister = async (req, res, next) => {
  // validate the data
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // end validate the data

  // check if the user is already in the database
  const emailExist = await Users.findOne({ where: { email: req.body.email } });
  const usernameExist = await Users.findOne({
    where: { username: req.body.username },
  });
  if (emailExist) return res.status(400).send("Email already exists");
  if (usernameExist) return res.status(400).send("Username already exists");

  // end check if the user is already in the database

  // Hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  // End Hash passwords

  const user = {
    fullName: req.body.fullName,
    email: req.body.email,
    username: req.body.username,
    password: hashPassword,
    role: req.body.role ? req.body.role : "admin-client",
  };
  try {
    // // // process create user
    const userCreate = await Users.create(user);
    // //
    res.json({
      status: 200,
      message: "Registrasi berhasil!",
      data: userCreate,
    });
  } catch (error) {
    res.status(400).send(err);
  }
};

// POST Login
exports.postLogin = async (req, res, next) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // check if the user is already in the database
  const userFromDB = await Users.findOne({ where: { email: req.body.email } });
  if (!userFromDB) return res.status(400).send("Email or password is wrong");
  // password is correct
  const validPass = await bcrypt.compare(
    req.body.password,
    userFromDB.password
  );
  if (!validPass) return res.status(400).send("Invalid password");
  // Create and assign a token
  const token = jwt.sign({ id: userFromDB.id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).json({
    status: 200,
    message: "Success Login!",
    data: userFromDB,
    token: token,
  });

  // res.send("Logged in!");
};
