const express = require("express");
const router = express.Router();
const sectionController = require("../controller/SectionController")


/* get All sections */
router.get('/sections', sectionController.list);

/* create new section */
router.post('/sections', sectionController.create);

/* get section by id */
router.get('/sections/:id', sectionController.getOne);

/* update section by id*/
router.put('/sections/:id', sectionController.update);

/* Delete a section */
router.delete('/sections/:id', sectionController.delete);

module.exports = router;
