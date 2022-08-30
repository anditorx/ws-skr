var express = require("express");
var router = express.Router();
const usersController = require("../src/controllers/Users");

/* GET users listing. */
router.get("/", usersController.getAllUsers);
router.post("/", usersController.postUser);

module.exports = router;
