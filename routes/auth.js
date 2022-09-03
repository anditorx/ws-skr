var express = require("express");
var router = express.Router();
// const usersController = require("../src/controllers/Users");
const authController = require("../src/controllers/Auth");

/* GET users listing. */
router.post("/register", authController.postRegister);
router.post("/login", authController.postLogin);

module.exports = router;
