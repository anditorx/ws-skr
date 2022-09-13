var express = require("express");
const bcrypt = require("bcryptjs");
var router = express.Router();
const Validator = require("fastest-validator");
const jwt = require("jsonwebtoken");
const val_ = new Validator();
const db = require("../../config/connection");
const { Organizations, Users } = require("../models");
const CryptoEncrypt = require("../utils/crypto");
const {
  createOrganizationValidation,
  putOrganizationValidation,
} = require("../validation/Organizations");
const sequelize = require("sequelize");
const { QueryTypes } = require("sequelize");

exports.getAllData = async (req, res, next) => {
  try {
    // const data = await Organizations.findAll();
    var sql =
      "SELECT * FROM organizations INNER JOIN users ON organizations.pic = users.id";
    db.query(sql, (err, result) => {
      return res.json({
        status: 200,
        message: "Success get all data user",
        data: result[0],
      });
    });
  } catch (error) {
    return res.json({
      status: 400,
      message: "Error get all data user",
      error,
    });
  }
};

exports.getDataById = async (req, res, next) => {
  const id = req.params.id;
  let dataFromDB = await Organizations.findOne({ where: { id: id } });
  if (!dataFromDB) return res.status(404).send("Organization not found");

  return res.json({
    status: 200,
    message: "Success get user by id",
    data: dataFromDB,
  });
};

// POST Organization
exports.postOrganization = async (req, res, next) => {
  // validate the data
  const { error } = createOrganizationValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // end validate the data

  // check if the user is already in the database
  const phoneNumberExists = await Organizations.findOne({
    where: { phone_number: req.body.phone_number },
  });
  if (phoneNumberExists) {
    return res.status(400).send("Phone Number already exists");
  }
  const userExists = await Users.findOne({
    where: { id: req.body.pic },
  });
  if (phoneNumberExists) {
    return res.status(400).send("Phone Number already exists");
  }
  if (!userExists) {
    return res.status(400).send("PIC not found");
  }
  // end check if the user is already in the database

  const organization = {
    name: req.body.name,
    phone_number: req.body.phone_number,
    address: req.body.address,
    pic: req.body.pic,
  };

  try {
    // process create organization
    const organizationCreate = await Organizations.create(organization);

    res.json({
      status: 200,
      message: "Success create organization!",
      data: organizationCreate,
    });
  } catch (error) {
    res.status(400).send(err);
  }
};

// PUT
exports.putOrganization = async (req, res, next) => {
  const id = req.params.id;
  const { error } = putOrganizationValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // check if the user is already in the database
  let dataFromDB = await Organizations.findOne({ where: { id: id } });
  if (!dataFromDB) return res.status(400).send("Organization not found");

  const organization = {
    name: req.body.name,
    phone_number: req.body.phone_number,
    address: req.body.address,
    pic: req.body.pic,
  };
  // update data
  dataFromDB = await Organizations.update(organization, { where: { id: id } });

  res.json({
    status: 200,
    message: "Success update organization!",
    data: organization,
  });
};

exports.deleteData = async (req, res, next) => {
  const id = req.params.id;
  let dataFromDB = await Organizations.findByPk(id);
  if (!dataFromDB) return res.status(404).send("Organization not found");

  dataFromDB = await Organizations.destroy({ where: { id: id } });

  return res.json({
    status: 200,
    message: "Success delete organization",
  });
};
