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
    role: "string|optional",
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

// PUT
exports.putUser = async (req, res, next) => {
  const id = req.params.id;
  let userPut = await Users.findByPk(id);

  if (!userPut) {
    return res.status(404).json({
      status: 404,
      message: "User tidak ditemukan",
    });
  }

  // validation
  const schema = {
    fullName: "string|optional",
    email: "string|optional",
    username: "string|optional",
    password: "string|optional",
    role: "string|optional",
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
  // update data
  userPut = await Users.update(user);
  res.json({
    status: 200,
    message: "Berhasil merubah data user",
    data: userUpdate,
  });
};
