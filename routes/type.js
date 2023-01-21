const auth = require("../middlewares/AuthMiddleware");
const upload = require("../middlewares/UploadMiddleware");

const express = require("express");
const router = express.Router();
const typeController = require("../controller/TypeController");


//create new Type
router.post('/types', upload, typeController.createType);








module.exports = router;