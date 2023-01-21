const auth = require("../middlewares/AuthMiddleware");
const upload = require("../middlewares/UploadMiddleware");

const express = require("express");
const router = express.Router();
const familyController = require("../controller/FamilyController");


//create new family
router.post('/family', upload, familyController.createFamily);

//get list of all types from all depots/categories 
router.get('/family/types', auth, familyController.listOfAllTypesFromAllDepot);


//get list of all families 
router.get('/family/all', auth, familyController.listOfAllFamilies);

//get list of all articles by family 
router.get('/family/articles/all', auth, familyController.listOfArticlesByFamily);

module.exports = router;