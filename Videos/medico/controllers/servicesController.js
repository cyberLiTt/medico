const path = require('path');
const fs = require('fs');
const Service = require('../models/servicesModel'); 
// Either export this way or the other way but not both at the same time for controllers

// Create a new service
exports.createService = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = req.file ? `/services/${req.file.filename}` : null;

    const service = new Service({ title, description, image });
    await service.save();
    console.log('✅ Service created successfully.');
    res.json({ message: 'Service created successfully.' });
  } catch (err) {
    console.error('❌ createService error:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET all services (with pagination)
exports.getAllServices = async (req, res) => {
  try {
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);

    // If no page/limit provided → fetch all services
    if (!page || !limit) {
      const services = await Service.find().sort({ createdAt: -1 });
      return res.status(200).json({
        data: services,
        totalItems: services.length,
        currentPage: 1,
        totalPages: 1
      });
    }

    // Otherwise paginate
    const skip = (page - 1) * limit;
    const total = await Service.countDocuments();
    const services = await Service.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      data: services,
      totalItems: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });

    console.log(`✅ Fetched ${services.length} services (page: ${page}, limit: ${limit})`);
  } catch (err) {
    console.error('❌ getAllServices error:', err);
    res.status(500).json({ error: err.message });
  }
};


// Get latest services
exports.latestServices = async (req, res) => {
  try {
    const latestServices = await Service.find()
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(latestServices);
  } catch (err) {
    console.error('❌ latestServices error:', err);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
};

// Get a single service by ID
exports.getSingleService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.status(200).json(service);
  } catch (err) {
    console.error('❌ getSingleService error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Update a service
exports.updateService = async (req, res) => {
  try {
    const { title, description } = req.body;
    const serviceId = req.params.id;

    // 🔎 Check if another service (not this one) has the same title
    const titleExists = await Service.findOne({
      _id: { $ne: serviceId },
      title: title.trim()
    });

    if (titleExists) {
      return res.status(400).json({ message: 'A service with this title already exists.' });
    }

    // Construct the update object
    const updateData = { title: title.trim(), description: description.trim() };

    // If a new image was uploaded, include it
    if (req.file) {
      updateData.image = `/services/${req.file.filename}`;
    }

    const service = await Service.findByIdAndUpdate(serviceId, updateData, { new: true });
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (err) {
    console.error('❌ updateService error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Delete a service
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found.' });

    // Delete image file if exists
    if (service.image) {
      const filePath = path.join(__dirname, '..', 'uploads', service.image.replace(/^\/+/, ''));
      fs.unlink(filePath, (err) => {
        if (err) {
          console.warn('⚠️ Failed to delete service image file:', err.message);
        } else {
          console.log(`✅ Service image deleted: ${filePath}`);
        }
      });
    }

    // Delete service from database
    await service.deleteOne();

    res.json({ success: true, message: 'Service deleted successfully.' });
  } catch (err) {
    console.error('❌ deleteService error:', err);
    res.status(500).json({ error: err.message });
  }
};