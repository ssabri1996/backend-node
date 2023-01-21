const auth = require("../middlewares/AuthMiddleware");
const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");



router.get('/users/:id', auth, userController.retrieve);
router.get('/users', auth, userController.getListActiveUsers);
router.post('/users', userController.create);
router.get('/user', auth, userController.profile);
/* reset Password */
router.put('/users/reset', userController.resetPassword);


module.exports = router;