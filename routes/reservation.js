const auth = require("../middlewares/AuthMiddleware");
const express = require("express");
const router = express.Router();
const reservationController = require("../controller/ReservationController")

//get list of rooms reservation site darichkeul
router.get('/reservations/check/room', reservationController.getListReservationRoom);

//create basic standard menus
router.post('/reservations/basic/menus', reservationController.createMenu)

//get list of menus reservation
router.get('/reservations/menus', auth, reservationController.getListReservationMenus)

/* filter reservation by status */
router.get('/reservations/filter', reservationController.getReservationByStatus);

//get list of rooms by names
router.get('/reservations/rooms', reservationController.getRoomsByNames);

//check room reservation
router.get('/reservations/check', auth, reservationController.checkRoomReservation);

//get Total price room  reservation
router.get('/reservations/total/:id', auth, reservationController.getTotalRoomPriceById);

//get list of rooms reservation
router.get('/reservations/:id', auth, reservationController.getRoomReservationById);

//get list of rooms reservation
router.get('/reservations', reservationController.getListReservation);

// new api to create reservation
router.post('/reservations', auth, reservationController.createReservation);

/*update standard reservation menu*/
router.put('/reservations/menusta/:id', auth, reservationController.updateStandardReservationMenu);

/* update perso reservation menu */
router.put('/reservations/menuperso/:id', auth, reservationController.updatePersoReservationMenu);


router.put('/reservations/:id', auth, reservationController.updateReservation);

router.delete('/reservations/:id', auth, reservationController.delete);

/* delete perso menu */
router.delete('/reservations/menu/:id', auth, reservationController.deletePersoMenu)

//create Personalize reservation menu
router.post('/reservations/menu/perso', auth, reservationController.createPersoReservationMenu);

//create standard reservation menu
router.post('/reservations/menu', auth, reservationController.createReservationMenu);

// new api to chech booking en linge
router.post('/booking', reservationController.checkBookingEnligne);
router.post('/booking/all', reservationController.checkBookingEnligneAllSuits);

// En ligne reservation and send email
router.post('/send', reservationController.reservationEnligneAndSendEmail);

// send email from contacte
router.post('/contacte', reservationController.contacteEmail);

module.exports = router;
