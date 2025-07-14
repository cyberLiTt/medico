const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const { uploadCarousel, uploadGallery } = require('../utils/multerConfig');

// Upload new image
router.post('/carousel/uploadCarouselImage', uploadCarousel.single('image'), imageController.uploadCarouselImage);

// Get all images (optionally filter by type ?type=carousel)
router.get('/carousel/getAllCarouselImages/', imageController.getAllCarouselImages);

// Get single image by ID
router.get('/carousel/getCarouselImageById/:id', imageController.getCarouselImageById);

// Update image info or replace image file
router.put('/carousel/updateCarouselImage/:id', uploadCarousel.single('image'), imageController.updateCarouselImage);

// Delete image
router.delete('/carousel/DeleteCarouselImage/:id', imageController.DeleteCarouselImage);






// Upload gallery image
router.post('/gallery/uploadGalleryImage', uploadGallery.single('image'), imageController.uploadGalleryImage);

// Get all gallery images
router.get('/gallery/getAllGalleryImages', imageController.getAllGalleryImages);

// Get single gallery image
router.get('/gallery/getSingleGalleryImage/:id', imageController.getSingleGalleryImage);

// Update gallery image
router.put('/gallery/updateGalleryImage/:id', uploadGallery.single('image'), imageController.updateGalleryImage);

// Delete gallery image
router.delete('/gallery/deleteGalleryImage/:id', imageController.deleteGalleryImage);

module.exports = router;
