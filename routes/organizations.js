var express = require("express");
var router = express.Router();
const organizationsController = require("../src/controllers/Organizations");
const verifyToken = require("../src/utils/verifyToken");

/* GET users listing. */
// router.get("/", verifyToken, usersController.getAllUsers);
router.post("/", verifyToken, organizationsController.postOrganization);
// router.put("/:id", usersController.putUser);

module.exports = router;
