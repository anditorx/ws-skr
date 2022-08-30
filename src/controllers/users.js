var express = require("express");
const bcrypt = require("bcryptjs");
var router = express.Router();
const Validator = require("fastest-validator");
const val_ = new Validator();
const { Users } = require("../models");
const CryptoEncrypt = require("../utils/crypto");
/* GET users listing. */
exports.getAllUsers = (req, res, next) => {
  const helloWorld = CryptoEncrypt.encrypt("Password1!");
  const helloWorldDec = CryptoEncrypt.decrypt(helloWorld);
  res.send(helloWorld);
};

// POST
exports.postUser = async (req, res, next) => {
  // validation
  const schema = {
    fullName: "string",
    email: "string",
    username: "string",
    password: "string",
  };

  // hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const user = {
    fullName: req.body.fullName,
    email: req.body.email,
    username: req.body.username,
    password: hashPassword,
    role: req.body.role ? req.body.role : "admin-client",
  };

  const validate = val_.validate(user, schema);

  if (validate.length) {
    return res.status(400).json(validate);
  }

  // // process create user
  const userCreate = await Users.create(user);
  //
  res.json({
    status: 200,
    message: "Berhasil menambahkan user",
    data: userCreate,
  });
};
