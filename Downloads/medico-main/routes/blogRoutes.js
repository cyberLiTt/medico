const express = require('express');
const router = express.Router();
const { uploadBlog } = require('../utils/multerConfig');
const blogController = require('../controllers/blogController');    // This way or
const { createBlog, getAllBlogs } = blogController;   // this way

// Create blog post (with optional image upload)
router.post('/createBlog', uploadBlog.single('image'), createBlog);

// List all blogs
router.get('/getAllBlogs', getAllBlogs);

// Latest news - 10
router.get('/latestNews', blogController.latestNews);

// Get single blog by ID
router.get('/getSingleBlog/:id', blogController.getSingleBlog);

// Update a blog post
router.post('/updateSingleBlog/:id', uploadBlog.single('image'), blogController.updateBlog);

// Delete a blog post
router.post('/deleteSingleBlog/:id', blogController.deleteBlog);

// Add a comment
router.post('/:id/addComment', blogController.addComment);

module.exports = router;
