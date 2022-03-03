const {Course, Student, StudentCourses} = require('../models')
const departments = ['Math', 'English', 'Music', 'Art', 'PE', 'World Languages', 'Social Studies', 'Science'].sort();

//view all
module.exports.viewAll = async function(req,res){
    const courses = await Course.findAll();
    res.render('course/view_all', {courses});
}

//profile
module.exports.viewProfile= async function(req,res){
    const course = await Course.findByPk(req.params.id, {
        include: 'students'
    });
    const students = await Student.findAll();
    let availableStudents = [];
    for (let i=0; i<students.length; i++){
        if (!courseHasStudent(course, students[i])){
            availableStudents.push(students[i])
        }
    }
    res.render('course/profile', {course, availableStudents})
}

//render add form
module.exports.renderAddForm =  function(req, res){
    if(!req.user.can('add course')){
        res.redirect('/');
        return
    }
    const course =  {
        name: '',
        department: departments[0],
        instructor_name: '',
        description:''
    }
    res.render('course/add', {course, departments});
}

//add
module.exports.addCourse = async function(req, res){
    if(!req.user.can('add course')){
        res.redirect('/');
        return
    }
    const course = await Course.create({
        name: req.body.name,
        department: req.body.department,
        instructor_name: req.body.instructor_name,
        description: req.body.description
    });
    res.redirect(`/courses/profile/${course.id}`);
}

//render edit form
module.exports.renderEditForm = async function(req, res){
    if(!req.user.can('edit course')){
        res.redirect('/');
        return
    }
    const course = await Course.findByPk(req.params.id);
    res.render('course/edit', {course, departments});
}

//update
module.exports.updateCourse = async function(req, res){
    if(!req.user.can('edit course')){
        res.redirect('/');
        return
    }
    const course = await Course.update({
        name: req.body.name,
        department: req.body.department,
        instructor_name: req.body.instructor_name,
        description: req.body.description
        }, {
        where: {
            id: req.params.id
        }
        });
    res.redirect(`/courses/profile/${req.params.id}`);
}

//delete
module.exports.deleteCourse = async function(req, res){
    if(!req.user.can('delete course')){
        res.redirect('/');
        return
    }
    await Course.destroy({
        where: {
            id:req.params.id
        }
        });
    res.redirect('/courses');
}

//Add student to a course
module.exports.enrollStudent = async function(req, res){
    const isAdmin = req.user.can('enroll student');
    const profileBelongsToUser = req.user.can('edit drop') && req.user.matchesStudentId(req.params.id);
    if (!isAdmin && !profileBelongsToUser){
        res.redirect('/')
        return
    }
    await StudentCourses.create({
        student_id: req.body.student,
        course_id: req.params.courseId
    });
    res.redirect(`/courses/profile/${req.params.courseId}`)
}

//remove a student from a course
module.exports.removeStudent = async function(req, res){
    const isAdmin = req.user.can('drop student');
    const profileBelongsToUser = req.user.can('edit drop') && req.user.matchesStudentId(req.params.id);
    if (!isAdmin && !profileBelongsToUser){
        res.redirect('/')
        return
    }
    await StudentCourses.destroy({
        where: {
            course_id: req.params.courseId,
            student_id: req.params.studentId
        }
    });
    res.redirect(`/courses/profile/${req.params.courseId}`);
}

function courseHasStudent(course, student) {
    for (let i = 0; i < course.students.length; i++) {
        if (student.id === course.students[i].id) {
            return true
        }
    }
    return false
}
