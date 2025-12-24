const path = require('path');
const fs = require('fs');
const Blog = require('../models/blogModel');
// Either export this way or the other way but not both at the same time for controllers

// Create a new blog post
exports.createBlog = async (req, res) => {
  try {
    const { title, message } = req.body;
    const image = req.file ? `/blog/${req.file.filename}` : null;

    const blog = new Blog({ title, message, image });
    await blog.save();
    console.log('Blog created successfully.');
    res.json({message: 'Blog created successfully.'});
  } catch (err) {
    console.error('❌ createBlog error:', err);
    res.status(500).json({ error: err.message });
  }
};





// GET all blogs (with pagination)
exports.getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const total = await Blog.countDocuments();
    const blogs = await Blog.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

    res.status(200).json({
      data: blogs,
      totalItems: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error('❌ getAllBlogs error:', err);
    res.status(500).json({ error: err.message });
  }
};




exports.latestNews = async (req, res) => {
  try {
    const latestBlogs = await Blog.find().sort({ createdAt: -1 }).limit(10);
    res.json(latestBlogs);
  } catch (err) {
    console.error('Error fetching latest news:', err);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
};


// Get a single blog by ID
exports.getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    res.status(200).json(blog);
  } catch (err) {
    console.error('❌ getBlog error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Update a blog post
exports.updateBlog = async (req, res) => {
  try {
    const { title, message } = req.body;
    const blogId = req.params.id;

    // 🔎 Check if another blog (not this one) has the same title
    const titleExists = await Blog.findOne({
      _id: { $ne: blogId },        // exclude current blog
      title: title.trim()
    });

    if (titleExists) {
      return res.status(400).json({ message: 'A blog with this title already exists.' });
    }

    // Construct the update object
    const updateData = { title: title.trim(), message: message.trim() };

    // If a new image was uploaded, include it
    if (req.file) {
      updateData.image = `/blog/${req.file.filename}`;
    }

    const blog = await Blog.findByIdAndUpdate(blogId, updateData, { new: true });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json(blog);
  } catch (err) {
    console.error('❌ updateBlog error:', err);
    res.status(500).json({ message: err.message });
  }
};


// Delete a blog post
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found.' });

    // Delete image file if exists
    if (blog.image) {
      const filePath = path.join(__dirname, '..', 'uploads', blog.image.replace(/^\/+/, ''));
      fs.unlink(filePath, (err) => {
        if (err) {
          console.warn('⚠️ Failed to delete image file:', err.message);
        } else {
          console.log(`✅ Blog image deleted: ${filePath}`);
        }
      });
    }

    // Delete blog from database
    await blog.deleteOne();

    res.json({ success: true, message: 'Blog deleted successfully.' });
  } catch (err) {
    console.error('❌ deleteBlog error:', err);
    res.status(500).json({ error: err.message });
  }
};




// Add a comment to a blog post
exports.addComment = async (req, res) => {
  try {
    const { name, email, comment } = req.body;
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    blog.comments.push({ name, email, comment });
    await blog.save();
    res.json(blog);
  } catch (err) {
    console.error('❌ addComment error:', err);
    res.status(500).json({ error: err.message });
  }
};
