var express = require("express");
const bcrypt = require("bcryptjs");
var router = express.Router();
const Validator = require("fastest-validator");
const val_ = new Validator();
const db = require("../../config/connection");
const { News } = require("../models");
const CryptoEncrypt = require("../utils/crypto");
const { createNewsValidation } = require("../validation/News");
const sequelize = require("sequelize");
const { QueryTypes } = require("sequelize");

// POST News
exports.postNews = async (req, res, next) => {
  // validate the data
  const { error } = createNewsValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // end validate the data

  if (!req.file) {
    const err = new Error("Image not uploaded");
    err.errorStatus = 422;
    throw err;
  }
  const image = req.file.path;

  const news = {
    title: req.body.title,
    body: req.body.body,
    author: req.body.author,
    image: image,
  };

  try {
    // process create organization
    const newsCreate = await News.create(news);

    res.json({
      status: 200,
      message: "Success create news!",
      data: newsCreate,
    });
  } catch (error) {
    res.status(400).send(err);
  }
};
