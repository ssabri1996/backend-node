const express = require("express");
const router = express.Router();
const suitsController = require("../controller/SuitsController")


/* get All suits */
router.get('/suits', suitsController.list);

/* create new suits */
router.post('/suits', suitsController.create);

/* get suits by id */
router.get('/suits/:id', suitsController.getOne);

/* update suits by id*/
router.put('/suits/:id', suitsController.update);

/* Delete a suits */
router.delete('/suits/:id', suitsController.delete);

module.exports = router;
