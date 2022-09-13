var express = require("express");
const bcrypt = require("bcryptjs");
var router = express.Router();
const Validator = require("fastest-validator");
const val_ = new Validator();
const db = require("../../config/connection");
const { News } = require("../models");
const CryptoEncrypt = require("../utils/crypto");
const path = require("path");
const fs = require("fs");
const {
  createNewsValidation,
  updateNewsValidation,
} = require("../validation/News");
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

// GET All News
exports.getAllNews = async (req, res, next) => {
  try {
    var sql =
      "SELECT news.*, users.fullName, organizations.name as organization_name FROM `news` INNER JOIN users ON news.author = users.id INNER JOIN organizations ON users.id = organizations.pic";
    db.query(sql, (err, result) => {
      return res.json({
        status: 200,
        message: "Success get all news",
        data: result,
      });
    });
  } catch (error) {
    return res.json({
      status: 400,
      message: "Error get all news",
      error,
    });
  }
};

// GET News by ID
exports.getNewsByID = async (req, res, next) => {
  try {
    var sql =
      "SELECT news.*, users.fullName, organizations.name as organization_name FROM `news` INNER JOIN users ON news.author = users.id INNER JOIN organizations ON users.id = organizations.pic WHERE news.id = " +
      req.params.id;
    db.query(sql, (err, result) => {
      return res.json({
        status: 200,
        message: "Success get news with id " + req.params.id,
        data: result,
      });
    });
  } catch (error) {
    return res.json({
      status: 400,
      message: "Error get news",
      error,
    });
  }
};

// PUT
exports.putNews = async (req, res, next) => {
  const id = req.params.id;
  const { error } = updateNewsValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // check if the user is already in the database
  let newsFromDB = await News.findOne({ where: { id: id } });
  if (!newsFromDB) return res.status(400).send("Data not found");

  // validasi file
  if (!req.file) {
    const err = new Error("Image not uploaded");
    err.errorStatus = 422;
    throw err;
  }

  const news = {
    title: req.body.title,
    body: req.body.body,
    author: req.body.author,
    image: req.file.path,
  };

  // update data
  newsFromDB = await News.update(news, { where: { id: id } });

  res.json({
    status: 200,
    message: "Success update news.",
    data: news,
  });
};

exports.deleteData = (req, res, next) => {
  const { id } = req.params;
  News.findOne({ where: { id: id } })
    .then((post) => {
      // validasi inputan
      if (!post) {
        const err = new Error("Data not found");
        err.errorStatus = 404;
        throw err;
      }
      // hapus image
      removeImage(post.image);
      // hapus dari database
      return News.destroy({
        where: {
          id: id,
        },
      });
    })
    .then((result) => {
      res.status(200).json({
        message: "Success delete data",
        data: result,
      });
    })
    .catch((err) => {
      next(err);
    });
};

const removeImage = (filePath) => {
  filePath = path.join(__dirname, "../..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
