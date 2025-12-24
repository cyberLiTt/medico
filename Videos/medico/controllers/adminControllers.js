const bcrypt = require('bcrypt');
const Admin = require('../models/adminModel');
const { hashPassword, comparePassword } = require('../utils/passwordHash');

const initAdmin = async () => {
  try {
    const existing = await Admin.findOne({ username: 'admin' });
    if (!existing) {
      const hashed = await hashPassword('admin54321');
      await Admin.create({ username: 'admin', passwordHash: hashed });
      console.log('✅ Default admin created.');
    } else {
      console.log('ℹ️ Admin already exists.');
    }
  } catch (error) {
    console.error('❌ Error initializing admin:', error.message);
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Step 1: Validate inputs
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Step 2: Find admin by username
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Username does not exist' });
    }

    // Step 3: Compare passwords
    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Step 4: Set session
    req.session.loggedIn = true;
    req.session.user = {
      id: admin._id,
      username: admin.username
    };

    // Step 5: Success response
    return res.status(200).json({ message: 'Login successful' });

  } catch (error) {
    console.error('❌ Login error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }

    const admin = await Admin.findOne({ username: 'admin' });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const match = await comparePassword(currentPassword, admin.passwordHash);
    if (!match) {
      return res.status(403).json({ message: 'Current password incorrect' });
    }

    admin.passwordHash = await hashPassword(newPassword);
    await admin.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('❌ Update password error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { initAdmin, loginAdmin, updatePassword };
