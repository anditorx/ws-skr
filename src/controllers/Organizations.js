var express = require("express");
const bcrypt = require("bcryptjs");
var router = express.Router();
const Validator = require("fastest-validator");
const jwt = require("jsonwebtoken");
const val_ = new Validator();
const { Organizations } = require("../models");
const CryptoEncrypt = require("../utils/crypto");
const { createOrganizationValidation } = require("../validation/Organizations");

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
  if (phoneNumberExists)
    return res.status(400).send("Phone Number already exists");
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
