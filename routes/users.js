var express = require("express");
var router = express.Router();
const usersController = require("../src/controllers/users");

/* GET users listing. */
router.get("/", usersController.getAllUsers);

module.exports = router;
