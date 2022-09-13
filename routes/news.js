var express = require("express");
var router = express.Router();
const newsController = require("../src/controllers/News");
const verifyToken = require("../src/utils/verifyToken");

/* route. */
router.post("/", verifyToken, newsController.postNews);
router.get("/", newsController.getAllNews);
router.get("/:id", verifyToken, newsController.getNewsByID);
router.put("/:id", verifyToken, newsController.putNews);
router.delete("/:id", verifyToken, newsController.deleteData);

module.exports = router;
