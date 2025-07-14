const express = require('express');
const { createDepartment, getAllDepartments, getDepartmentById, updateSingleDepartment, deleteSingleDepartment, addDoctor, getAllDoctors, updateDoctor, deleteDoctor, getDoctorsInDepartment, getSingleDoctor} = require('../controllers/departmentsController');

const router = express.Router();

// Create department
router.post('/createDepartment', createDepartment);

// Get all departments
router.get('/getAllDepartments', getAllDepartments);

// Get one department by ID
router.get('/getSingleDepartment/:id', getDepartmentById);

// Update department
router.put('/updateSingleDepartment/:id', updateSingleDepartment);

// Delete department
router.delete('/deleteSingleDepartment/:id', deleteSingleDepartment);


// CRUD for doctors nested in departments
// Add doctor to department
router.post('/doctors/add', addDoctor);
router.get('/doctors/getAllDoctors', getAllDoctors);
router.get('/:departmentId/doctors', getDoctorsInDepartment);
router.get('/:departmentId/doctors/:doctorId', getSingleDoctor);
router.put('/:departmentId/doctors/:doctorId', updateDoctor);
router.delete('/:departmentId/doctors/:doctorId', deleteDoctor);

module.exports = router;
