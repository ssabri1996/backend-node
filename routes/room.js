const auth = require("../middlewares/AuthMiddleware");
const express = require("express");
const router = express.Router();
const roomController = require("../controller/RoomController")



router.get('/rooms/:id', auth, roomController.retrieve);
router.get('/rooms', roomController.getStandardRoomsByName);
router.get('/roomslist', roomController.list);
router.post('/rooms', roomController.createRooms);
router.put('/rooms/:id', auth, roomController.update);
router.delete('/rooms/:id', auth, roomController.delete);

module.exports = router;
