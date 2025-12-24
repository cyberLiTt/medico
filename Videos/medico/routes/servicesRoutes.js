const express = require('express');
const router = express.Router();
const { uploadService } = require('../utils/multerConfig');
const servicesController = require('../controllers/servicesController');    // This way or
const { createService, getAllServices } = servicesController;   // this way

// Create service (with optional image upload)
router.post('/createService', uploadService.single('image'), createService);

// List all services
router.get('/getAllServices', getAllServices);

// Latest Services - 10
router.get('/latestServices', servicesController.latestServices);

// Get single service by ID
router.get('/getSingleService/:id', servicesController.getSingleService);

// Update a service
router.post('/updateSingleService/:id', uploadService.single('image'), servicesController.updateService);

// Delete a service
router.post('/deleteSingleService/:id', servicesController.deleteService);


module.exports = router;
