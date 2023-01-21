const auth = require("../middlewares/AuthMiddleware");
const upload = require("../middlewares/UploadMiddleware");

const express = require("express");
const router = express.Router();
const depotController = require("../controller/DepotController")


//create new depot 
router.post('/depots', upload, depotController.createDepot);

//get list depots
router.get('/depots', auth, depotController.listDepot);

//get list categories from all depots 
router.get('/depots/categories', auth, depotController.listOfAllCategoryFromAllDepot);

//get list of all articles from all depots/categories 
router.get('/depots/categories/familys/types/articles', auth, depotController.listOfAllArticlesFromAllDepot);

//get list of all family from all depots 
router.get('/depots/categories/familys', auth, depotController.listOfAllFamilyDepot);


//get list of all articles by categorie
router.get('/depots/articles', auth, depotController.listOfAllArticlesByCategorie);

//get list of all articles by family
router.get('/depots/articles/categorie', auth, depotController.listOfAllArticlesByFamily);

//get list of all family by depot
router.get('/depots/family/all', auth, depotController.listOfAllFamilyByDepot);

//get list of all types by category
router.get('/depots/types/family', auth, depotController.listOfAllTypesByCategory);

//get list of all types by category2
router.get('/depots/types/family/articles', auth, depotController.listOfAllTypesByCategory2);


module.exports = router;