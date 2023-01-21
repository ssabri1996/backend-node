const auth = require("../middlewares/AuthMiddleware");
const express = require("express");
const router = express.Router();
const menuController = require("../controller/MenuController")

router.get('/menus/desc', auth, menuController.getMenusByNature);
router.get('/menus/nature', auth, menuController.getMenusByDescription);
router.get('/menus/name', auth, menuController.getMenusByNames);
router.get('/menus/:id', auth, menuController.retrieve);
router.get('/menus', auth, menuController.list);
router.post('/menus', auth, menuController.create);
router.put('/menus/:id', auth, menuController.update);
router.delete('/menus/:id', auth, menuController.delete);

module.exports = router;