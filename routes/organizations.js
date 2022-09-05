var express = require("express");
var router = express.Router();
const organizationsController = require("../src/controllers/Organizations");
const verifyToken = require("../src/utils/verifyToken");

/* GET users listing. */
router.get("/", organizationsController.getAllData);
router.get("/:id", organizationsController.getDataById);
router.post("/", verifyToken, organizationsController.postOrganization);
router.put("/:id", verifyToken, organizationsController.putOrganization);
router.delete("/:id", verifyToken, organizationsController.deleteData);

module.exports = router;
