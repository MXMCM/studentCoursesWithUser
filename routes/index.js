var express = require('express');
var router = express.Router();
const courseController = require('../controllers/courseController.js');
const studentController = require('../controllers/studentController.js');
const userController = require('../controllers/userController.js');

function redirectGuests(req,res,next){
  if (!req.user){
    res.redirect('/login');
    return
  }
  next();
}
/* GET home page. */
router.get('/', function(req, res) {
  res.redirect('/courses');
});

router.get('/courses', redirectGuests, courseController.viewAll);
router.get('/courses/profile/:id', redirectGuests, courseController.viewProfile);
router.get('/courses/edit/:id',redirectGuests, courseController.renderEditForm);
router.post('/courses/edit/:id',redirectGuests, courseController.updateCourse);
router.get('/courses/add',redirectGuests, courseController.renderAddForm);
router.post('/courses/add',redirectGuests, courseController.addCourse);
router.get('/courses/delete/:id',redirectGuests, courseController.deleteCourse);


router.get('/students',redirectGuests, studentController.viewAll);
router.get('/students/profile/:id',redirectGuests, studentController.viewProfile);
router.get('/students/edit/:id',redirectGuests, studentController.renderEditForm);
router.post('/students/edit/:id',redirectGuests, studentController.updateStudent);
router.get('/students/delete/:id',redirectGuests, studentController.deleteStudent);

router.post('/students/:studentId/enroll/',redirectGuests, studentController.enrollStudent);
router.get('/students/:studentId/removeCourse/:courseId',redirectGuests, studentController.removeCourse);
router.post('/courses/:courseId/enroll',redirectGuests, courseController.enrollStudent);
router.get('/courses/:courseId/removeStudent/:studentId',redirectGuests, courseController.removeStudent);

router.get('/register-student', userController.renderStudentRegistrationForm);
router.post('/register-student', userController.registerStudent);
router.get('/login',userController.renderLoginForm);
router.post('/login', userController.authenticate);
router.get('/register-staff', userController.renderStaffRegistrationForm);
router.post('/register-staff', userController.registerStaff);
router.get('/logout', userController.logout);
module.exports = router;
