const express = require('express');
const { uploadDepartment, uploadDoctor } = require('../utils/multerConfig');
const { createDepartment, getAllDepartments, getDepartmentById, updateSingleDepartment, deleteSingleDepartment, addDoctor, getAllDoctors, updateDoctor, deleteDoctor, getDoctorsInDepartment, getSingleDoctor} = require('../controllers/departmentsController');

const router = express.Router();

// Create department
router.post('/createDepartment', uploadDepartment.single('departmentImage'), createDepartment);

// Get all departments
router.get('/getAllDepartments', getAllDepartments);

// Get one department by ID
router.get('/getSingleDepartment/:id', getDepartmentById);

// Update department
router.put('/updateSingleDepartment/:id', uploadDepartment.single('departmentImage'), updateSingleDepartment);

// Delete department
router.delete('/deleteSingleDepartment/:id', deleteSingleDepartment);


// CRUD for doctors nested in departments
// Add doctor to department
router.post('/doctors/add', uploadDoctor.single('profilePic'), addDoctor);
router.get('/doctors/getAllDoctors', getAllDoctors);
router.get('/:departmentId/doctors', getDoctorsInDepartment);
router.get('/:departmentId/doctors/:doctorId', getSingleDoctor);
router.patch('/:departmentId/doctors/:doctorId', uploadDoctor.single('profilePic'), updateDoctor);
router.delete('/:departmentId/doctors/:doctorId', deleteDoctor);

module.exports = router;
