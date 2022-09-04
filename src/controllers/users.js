var express = require("express");
const bcrypt = require("bcryptjs");
var router = express.Router();
const Validator = require("fastest-validator");
const val_ = new Validator();
const { Users } = require("../models");
const CryptoEncrypt = require("../utils/crypto");
const { userPutValidation } = require("../validation/Users");

/* GET users listing. */
exports.getAllUsers = async (req, res, next) => {
  const data = await Users.findAll();
  return res.json({
    status: 200,
    message: "Success get all data user",
    data,
  });
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
  const { error } = userPutValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // check if the user is already in the database
  let userFromDB = await Users.findOne({ where: { id: id } });
  if (!userFromDB) return res.status(400).send("User tidak ditemukan");

  const validPass = await bcrypt.compare(
    req.body.password,
    userFromDB.password
  );
  if (!validPass) return res.status(400).send("Invalid password");

  // hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const user = {
    fullName: req.body.fullName,
    email: req.body.email,
    password: hashPassword,
    username: req.body.username,
  };
  // update data
  userFromDB = await Users.update(user, { where: { id: id } });

  res.json({
    status: 200,
    message: "Berhasil merubah data user",
    data: user,
  });
};

exports.getUserById = async (req, res, next) => {
  const id = req.params.id;
  let userFromDB = await Users.findOne({ where: { id: id } });
  if (!userFromDB) return res.status(404).send("User tidak ditemukan");

  return res.json({
    status: 200,
    message: "Success get user by id",
    userFromDB,
  });
};

exports.deleteUser = async (req, res, next) => {
  const id = req.params.id;
  let userFromDB = await Users.findByPk(id);
  if (!userFromDB) return res.status(404).send("User tidak ditemukan");

  userFromDB = await Users.destroy({ where: { id: id } });

  return res.json({
    status: 200,
    message: "Success delete user",
  });
};
