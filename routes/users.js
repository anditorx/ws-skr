var express = require("express");
var router = express.Router();
const usersController = require("../src/controllers/Users");
const verifyToken = require("../src/utils/verifyToken");
/* GET users listing. */
router.get("/", verifyToken, usersController.getAllUsers);
router.post("/", usersController.postUser);
router.put("/:id", usersController.putUser);

module.exports = router;
