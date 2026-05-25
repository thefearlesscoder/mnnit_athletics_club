import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import LoginRequest from '../models/LoginRequest.js';
import ApprovedEmail from '../models/ApprovedEmail.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register a new whitelisted member
export const registerUser = async (req, res) => {
  const { name, email, password, role, branch, batch, events, achievements, linkedIn, instagram, dateOfBirth, profilePhoto } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  try {
    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // 2. Verify that the email is in the ApprovedEmail list
    const isApproved = await ApprovedEmail.findOne({ email });
    if (!isApproved) {
      return res.status(403).json({ message: 'Email is not approved. Please get an approved email.' });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'member',
      branch,
      batch,
      events: Array.isArray(events) ? events : [],
      achievements: Array.isArray(achievements) ? achievements : [],
      linkedIn,
      instagram,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      profilePhoto,
    });

    res.status(201).json({
      message: 'Registration successful! You can now log in.',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const editProfile = async(req , res) =>{

};