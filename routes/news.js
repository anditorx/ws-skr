var express = require("express");
var router = express.Router();
const newsController = require("../src/controllers/News");
const verifyToken = require("../src/utils/verifyToken");

/* route. */
router.post("/", verifyToken, newsController.postNews);

module.exports = router;
