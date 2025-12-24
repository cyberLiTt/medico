const DepartmentsModel = require('../models/departmentsModel');

// Create Department
const createDepartment = async (req, res) => {
  const { name, description } = req.body;
  const image = req.file?.filename;

  try {
    const departmentCount = await DepartmentsModel.countDocuments();
    if (departmentCount >= 7) {
      return res.status(400).json({ message: 'Maximum of 7 departments allowed.' });
    }

    const existing = await DepartmentsModel.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ message: 'Department already exists.' });
    }

    const department = new DepartmentsModel({
      name: name.trim(),
      description: description?.trim() || '',
      imageUrl: image ? `/departments/${image}` : null,
      doctors: []
    });

    await department.save();

    res.status(201).json({
      message: 'Department created successfully',
      department
    });
  } catch (err) {
    console.error('Error creating department:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};



// Read All Departments
const getAllDepartments = async (req, res) => {
  try {
    const departments = await DepartmentsModel.find();
    res.status(200).json(departments);
  } catch (err) {
    console.error('Error fetching departments:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Read Single Department by ID
const getDepartmentById = async (req, res) => {
  try {
    const department = await DepartmentsModel.findById(req.params.id);
    if (!department) return res.status(404).json({ message: 'Department not found' });
    res.status(200).json(department);
  } catch (err) {
    console.error('Error fetching department:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};



// Update Department Name
const updateSingleDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;
    const id = req.params.id;

    const existing = await DepartmentsModel.findOne({ name: name.trim(), _id: { $ne: id } });
    if (existing) {
      return res.status(400).json({ message: 'Department already exists.' });
    }

    const updateFields = {
      name: name.trim(),
      description: description?.trim() || '',
    };

    if (req.file) {
      updateFields.imageUrl = `/departments/${req.file.filename}`;
    }

    const department = await DepartmentsModel.findByIdAndUpdate(id, updateFields, { new: true });

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.status(200).json({ message: 'Department updated', department });
  } catch (err) {
    console.error('Error updating department:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};


// Delete Department
const deleteSingleDepartment = async (req, res) => {
  try {
    const department = await DepartmentsModel.findByIdAndDelete(req.params.id);
    if (!department) return res.status(404).json({ message: 'Department not found' });
    res.status(200).json({ message: 'Department deleted successfully' });
  } catch (err) {
    console.error('Error deleting department:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};















// Add Doctor to Department
const addDoctor = async (req, res) => {
  const { name, department, email, phone, role, description } = req.body;

  try {
    const foundDepartment = await DepartmentsModel.findById(department);
    if (!foundDepartment) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Limit doctors in a department
    if (foundDepartment.doctors.length >= 10) {
      return res.status(400).json({ message: 'This department already has 10 doctors. Maximum limit reached.' });
    }

    // Check if doctor with same name already exists
    const doctorExists = foundDepartment.doctors.some(
      (doc) => doc.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (doctorExists) {
      return res.status(400).json({ message: `${name} is already in this department.` });
    }

    // Check if doctor with same email already exists
    const emailExists = foundDepartment.doctors.some(
      (doc) => doc.email?.toLowerCase() === email.trim().toLowerCase()
    );
    if (emailExists) {
      return res.status(400).json({ message: `A doctor with email ${email} is already in this department.` });
    }

    // Handle doctor image upload
    const profilePic = req.file ? `/doctors/${req.file.filename}` : null;

    // Add new doctor with full fields
    foundDepartment.doctors.push({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role: role?.trim() || null,
      description: description?.trim() || null,
      profilePic
    });

    await foundDepartment.save();
    res.status(200).json({ message: 'Doctor successfully added.' });

  } catch (err) {
    console.error('Error adding doctor:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};






// GET API to fetch departments and doctors
const getAllDoctors = async (req, res) => {
  try {
    const departments = await DepartmentsModel.find();
    res.json({ departments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching doctors' });
  }
};





// Uddate doctor
const updateDoctor = async (req, res) => {
  const { departmentId, doctorId } = req.params;
  const { name, email, phone, role, description } = req.body;

  try {
    const department = await DepartmentsModel.findById(departmentId);
    if (!department) return res.status(404).json({ message: 'Department not found' });

    const doctor = department.doctors.id(doctorId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found in this department' });

    const trimmedName = name.trim().toLowerCase();
    const trimmedEmail = email.trim().toLowerCase();

    // Check for name/email conflict with OTHER doctors
    const conflict = department.doctors.some(doc =>
      doc._id.toString() !== doctorId &&
      (
        doc.name.toLowerCase() === trimmedName ||
        doc.email?.toLowerCase() === trimmedEmail
      )
    );

    if (conflict) {
      return res.status(400).json({ message: 'Another doctor in this department has the same name or email.' });
    }

    // Update text fields
    doctor.name = name.trim();
    doctor.email = email.trim();
    doctor.phone = phone.trim();
    doctor.role = role?.trim() || doctor.role;
    doctor.description = description?.trim() || doctor.description;

    // Update profile picture if uploaded
    if (req.file) {
      doctor.profilePic = `/doctors/${req.file.filename}`;
    }

    await department.save();

    res.status(200).json({
      message: 'Doctor updated successfully',
      doctor
    });

  } catch (err) {
    console.error('Error updating doctor:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};







// Delete a Doctor from a Department
const deleteDoctor = async (req, res) => {
  const { departmentId, doctorId } = req.params;

  try {
    const department = await DepartmentsModel.findById(departmentId);
    if (!department) return res.status(404).json({ message: 'Department not found' });

    const doctor = department.doctors.id(doctorId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found in this department' });

    // Use pull to remove the doctor by ID
    department.doctors.pull({ _id: doctorId });

    await department.save();

    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (err) {
    console.error('Error deleting doctor:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};




// Get all doctors in a department
const getDoctorsInDepartment = async (req, res) => {
  const { departmentId } = req.params;
  try {
    const department = await DepartmentsModel.findById(departmentId);
    if (!department) return res.status(404).json({ message: 'Department not found' });

    res.status(200).json(department.doctors);
  } catch (err) {
    console.error('Error getting doctors:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};



// Get a single doctor by ID from a department
const getSingleDoctor = async (req, res) => {
  const { departmentId, doctorId } = req.params;
  try {
    const department = await DepartmentsModel.findById(departmentId);
    if (!department) return res.status(404).json({ message: 'Department not found' });

    const doctor = department.doctors.id(doctorId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    // ✅ Return doctor + department name
    res.status(200).json({
      ...doctor.toObject(),
      departmentName: department.name
    });
  } catch (err) {
    console.error('Error fetching doctor:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};



module.exports = { createDepartment, getAllDepartments, getDepartmentById, updateSingleDepartment, deleteSingleDepartment, addDoctor, getAllDoctors, updateDoctor, deleteDoctor, getDoctorsInDepartment, getSingleDoctor };
