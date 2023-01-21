const auth = require("../middlewares/AuthMiddleware");
const express = require("express");
const router = express.Router();
const courseController = require("../controller/CourseController");


//create new Course
router.post('/courses', auth, courseController.createCourse);

//get list Courses by price
router.get('/courses/filter', auth, courseController.getlistCoursesByPrice);

//get list Courses by multiple options
router.get('/courses/filter/deep', auth, courseController.getlistCoursesByMuliplesOptions);


//get list Courses by month
router.get('/courses/month', auth, courseController.getlistCoursesByMonth);

//get list Courses by person
router.get('/courses/person', auth, courseController.getlistCoursesByPerson);

//get list Courses by date
router.get('/courses', auth, courseController.getlistCourses);

//get Course by id
router.get('/courses/:id', auth, courseController.getCoursesById);


//update Course by id
router.put('/courses/:id', auth, courseController.update);





module.exports = router;