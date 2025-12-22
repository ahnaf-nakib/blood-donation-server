const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// 🔍 Donor Search (Blood Group, District, Upazila) – Case Insensitive
const searchDonors = async (req, res) => {
  try {
    const { bloodGroup, district, upazila } = req.query;

    let query = { role: 'donor', status: 'active' };

    if (bloodGroup) {
      query.bloodGroup = bloodGroup;
    }

    if (district) {
      query.district = { $regex: new RegExp(`^${district}$`, 'i') };
    }

    if (upazila) {
      query.upazila = { $regex: new RegExp(`^${upazila}$`, 'i') };
    }

    const donors = await User.find(query).select('-password');
    res.json(donors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ১. Register
const register = async (req, res) => {
  const { email, name, avatar, bloodGroup, district, upazila, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      name,
      avatar,
      bloodGroup,
      district,
      upazila,
      password: hashedPass
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ২. Login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({
        error: 'Your account is blocked. Please contact admin.'
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ৩. Get all users (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ৪. Update user role
const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  try {
    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ৫. Block / Unblock user
const toggleBlockUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.status = user.status === 'active' ? 'blocked' : 'active';
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ৬. Update profile
const updateProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  register,
  login,
  getAllUsers,
  updateUserRole,
  toggleBlockUser,
  updateProfile,
  searchDonors
};
