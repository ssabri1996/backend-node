const auth = require("../middlewares/AuthMiddleware");
const express = require("express");
const router = express.Router();
const inventaireController = require("../controller/InventaireController");

//create new Inventaire
router.post("/inventaires", auth, inventaireController.createInventaire);

//get list Inventaires
router.get("/inventaires", auth, inventaireController.getInventaires);

//edit inventaire
router.put('/inventaires/:id', auth, auth, inventaireController.update);

// delete inventaire
router.delete('/inventaires/:id', auth, inventaireController.delete);

// get one inventaire by id
router.get('/inventaires/:id', auth, inventaireController.retrieve);

module.exports = router;