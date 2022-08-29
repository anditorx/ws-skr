var express = require("express");
var router = express.Router();
const usersController = require("../src/controllers/Users");

/* GET users listing. */
router.get("/", usersController.getAllUsers);

module.exports = router;
