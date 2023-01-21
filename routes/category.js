const auth = require("../middlewares/AuthMiddleware");
const upload = require("../middlewares/UploadMiddleware");

const express = require("express");
const router = express.Router();
const categoryController = require("../controller/CategoryController")


//create new category
router.post('/categories', upload, categoryController.createCategory);


//get list categories by depot
router.get('/categories/depot', auth, categoryController.listOfCategorysByDepot);

//get list family by categorie
router.get('/categories', auth, categoryController.listOfAllFamilyByCategory);

//get list types by family
router.get('/categories/family', auth, categoryController.listOfTypesByFamily);

//get list articles by type
router.get('/categories/family/type', auth, categoryController.listOfArticlesByType);

//get list articles by depot
router.get('/categories/articles/depot', auth, categoryController.listOfArticlesByDepot);


module.exports = router;
