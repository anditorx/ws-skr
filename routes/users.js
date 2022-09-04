var express = require("express");
var router = express.Router();
const usersController = require("../src/controllers/Users");
const verifyToken = require("../src/utils/verifyToken");
/* GET users listing. */
router.get("/", usersController.getAllUsers);
router.post("/", verifyToken, usersController.postUser);
router.put("/:id", verifyToken, usersController.putUser);
router.get("/:id", verifyToken, usersController.getUserById);
router.delete("/:id", verifyToken, usersController.deleteUser);

module.exports = router;
