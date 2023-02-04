const auth = require("../middlewares/AuthMiddleware");
const express = require("express");
const router = express.Router();
const demandeController = require("../controller/DemandeController")

//Create a location request
router.post('/demande', demandeController.createDemande);
// get all demandes
router.get('/demande', demandeController.getAllDemandes);
// approve demande
router.post('/demande/:id', demandeController.approveDemande);

module.exports = router;