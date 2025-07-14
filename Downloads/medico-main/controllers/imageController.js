const Image = require('../models/imageModel');
const path = require('path');
const fs = require('fs');

exports.uploadCarouselImage = async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required.' });
    }

    // ⚠️ Check if type is 'carousel' and limit to 3
    if (type === 'carousel') {
      const count = await Image.countDocuments({ type: 'carousel' });
      if (count >= 3) {
        return res.status(400).json({ message: 'Maximum of 3 carousel images allowed.' });
      }
    }

    // 🔍 Check for duplicate name within the same type
    const existing = await Image.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      type
    });
    if (existing) {
      return res.status(400).json({ message: 'An image with this name already exists for this type.' });
    }

    const url = `/${type}/${req.file.filename}`;

    const image = new Image({
      name,
      url,
      type
    });

    await image.save();
    res.status(201).json({ message: 'Image uploaded successfully.', image });
  } catch (err) {
    console.error('❌ uploadImage error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getAllCarouselImages = async (req, res) => {
  try {
    const images = await Image.find({ type: 'carousel' }).sort({ dateUploaded: -1 });
    res.json(images);
  } catch (err) {
    console.error('❌ getCarouselImages error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getCarouselImageById = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found.' });
    res.json(image);
  } catch (err) {
    console.error('❌ getImage error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.updateCarouselImage = async (req, res) => {
  try {
    const { name, type } = req.body;
    const id = req.params.id;
    const updateData = { name };

    const existing = await Image.findOne({ _id: { $ne: id }, name: { $regex: `^${name.trim()}$`, $options: 'i' }, type: type });
    if (existing) {
      return res.status(400).json({ message: 'Image name already exists for the type carousel.' });
    }

    if (req.file) {
      const newUrl = `/carousel/${req.file.filename}`;
      updateData.url = newUrl;
    }

    const image = await Image.findByIdAndUpdate(id, updateData, { new: true });
    if (!image) return res.status(404).json({ message: 'Image not found.' });

    res.json({ message: 'Image updated successfully.', image });
  } catch (err) {
    console.error('❌ updateImage error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.DeleteCarouselImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found.' });

    // Delete file from disk
    const filePath = path.join(__dirname, '..', 'uploads', image.url.replace(/^\/+/, ''));
    fs.unlink(filePath, (err) => {
      if (err) {
        console.warn('⚠️ Failed to delete file:', err.message);
      } else {
        console.log(`✅ File deleted: ${filePath}`);
      }
    });

    await image.deleteOne();
    res.json({ message: 'Image deleted successfully.' });
  } catch (err) {
    console.error('❌ deleteImage error:', err);
    res.status(500).json({ message: err.message });
  }
};









exports.uploadGalleryImage = async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required.' });
    }

    // ⚠️ Check if type is 'gallery' and limit to 20
    if (type === 'gallery') {
      const count = await Image.countDocuments({ type: 'gallery' });
      if (count >= 10) {
        return res.status(400).json({ message: 'Maximum of 10 gallery images allowed.' });
      }
    }

    // 🔍 Check for duplicate name within the same type (case-insensitive)
    const existing = await Image.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }, type });
    if (existing) {
      return res.status(400).json({ message: 'An image with this name already exists for this type.' });
    }

    const url = `/${type}/${req.file.filename}`;

    const image = new Image({
      name,
      url,
      type
    });

    await image.save();
    res.status(201).json({ message: 'Image uploaded successfully.', image });
  } catch (err) {
    console.error('❌ uploadGalleryImage error:', err);
    res.status(500).json({ message: err.message });
  }
};


exports.getAllGalleryImages = async (req, res) => {
  try {
    const images = await Image.find({ type: 'gallery' }).sort({ dateUploaded: -1 });
    res.json(images);
  } catch (err) {
    console.error('❌ getGalleryImages error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getSingleGalleryImage = async (req, res) => {
  try {
    const image = await Image.findOne({ _id: req.params.id, type: 'gallery' });
    if (!image) return res.status(404).json({ message: 'Gallery image not found.' });
    res.json(image);
  } catch (err) {
    console.error('❌ getSingleGalleryImage error:', err);
    res.status(500).json({ message: err.message });
  }
};


exports.updateGalleryImage = async (req, res) => {
  try {
    const { name, type } = req.body;
    const id = req.params.id;
    const updateData = { name };

    // 🔍 Check for duplicate name in the same type, excluding current record
    const existing = await Image.findOne({
      _id: { $ne: id },
      name: { $regex: `^${name.trim()}$`, $options: 'i' },
      type
    });

    if (existing) {
      return res.status(400).json({ message: 'Image name already exists for the type gallery.' });
    }

    // 🖼️ Update image URL if new file is uploaded
    if (req.file) {
      const newUrl = `/${type}/${req.file.filename}`;
      updateData.url = newUrl;
    }

    // 🔄 Update the image record
    const image = await Image.findByIdAndUpdate(id, updateData, { new: true });
    if (!image) return res.status(404).json({ message: 'Image not found.' });

    res.json({ message: 'Image updated successfully.', image });
  } catch (err) {
    console.error('❌ updateGalleryImage error:', err);
    res.status(500).json({ message: err.message });
  }
};


exports.deleteGalleryImage = async (req, res) => {
  try {
    const image = await Image.findOne({ _id: req.params.id, type: 'gallery' });
    if (!image) return res.status(404).json({ message: 'Gallery image not found.' });

    // Delete file from disk
    const filePath = path.join(__dirname, '..', 'uploads', image.url.replace(/^\/+/, ''));
    fs.unlink(filePath, (err) => {
      if (err) {
        console.warn('⚠️ Failed to delete file:', err.message);
      } else {
        console.log(`✅ File deleted: ${filePath}`);
      }
    });

    await image.deleteOne();
    res.json({ message: 'Gallery image deleted successfully.' });
  } catch (err) {
    console.error('❌ deleteGalleryImage error:', err);
    res.status(500).json({ message: err.message });
  }
};

