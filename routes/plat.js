const auth = require("../middlewares/AuthMiddleware");
const express = require("express");
const router = express.Router();
const platController = require("../controller/PlatController")



router.get('/plats/:id', platController.retrieve);
router.get('/plats', auth, platController.list);
router.post('/plats', platController.create);
router.put('/plats/:id', platController.update);
router.delete('/plats/:id', platController.delete);

module.exports = router;