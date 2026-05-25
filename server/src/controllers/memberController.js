import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET , { expiresIn: '2h' });

// ─── PUBLIC: Verify magic link token ─────────────────────────────────────────
// GET /api/v1/member/verify-token?token=xxx
export const verifyMagicLink = async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ message: 'Token is required.' });

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(401).json({ message: 'This link is invalid or has expired.' });
    }

    // Clear the one-time token now that it's been used
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Return a 2-hour session JWT + user profile data (this is still a problem)
    res.json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch: user.branch,
        batch: user.batch,
        events: user.events,
        achievements: user.achievements,
        linkedIn: user.linkedIn,
        instagram: user.instagram,
        birthday: user.dateOfBirth ? user.dateOfBirth.toISOString().split('T')[0] : '',
        profilePhoto: user.profilePhoto,
        isCaptain: user.isCaptain,
      },
    });
  } catch (error) {
    console.error('[verifyMagicLink]', error.message);
    res.status(500).json({ message: error.message });
  }
};

// ─── MEMBER: Get own profile ──────────────────────────────────────────────────
// GET /api/v1/member/profile   (requires Bearer JWT)
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -resetPasswordToken -resetPasswordExpire');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── MEMBER: Update own profile ───────────────────────────────────────────────
// PUT /api/v1/member/profile   (requires Bearer JWT)
export const updateMyProfile = async (req, res) => {
  const { name, branch, batch, events, achievements, linkedIn, instagram, birthday, dateOfBirth, profilePhoto } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (name) user.name = name;
    if (branch !== undefined) user.branch = branch;
    if (batch !== undefined) user.batch = batch;
    if (events !== undefined) user.events = Array.isArray(events) ? events : events.split(',').map(e => e.trim()).filter(Boolean);
    if (achievements !== undefined) user.achievements = Array.isArray(achievements) ? achievements : achievements.split(',').map(a => a.trim()).filter(Boolean);
    if (linkedIn !== undefined) user.linkedIn = linkedIn;
    if (instagram !== undefined) user.instagram = instagram;
    
    const dob = dateOfBirth || birthday;
    if (dob !== undefined) user.dateOfBirth = dob ? new Date(dob) : undefined;
    if (profilePhoto !== undefined) user.profilePhoto = profilePhoto;

    const updated = await user.save();
    res.json({ message: 'Profile updated successfully.', user: updated });
  } catch (error) {
    console.error('[updateMyProfile]', error.message);
    res.status(500).json({ message: error.message });
  }
};

// add dummy members from (by admin) -> dummy route
export const addMember = async (req, res) => {
  try {
    const { name, email, password, role, branch, batch, events, achievements, linkedIn, instagram, birthday, dateOfBirth, profilePhoto } = req.body;
    const dob = dateOfBirth || birthday;
    const user = await User.create({ 
      name, 
      email, 
      password, 
      role, 
      branch, 
      batch, 
      events, 
      achievements, 
      linkedIn, 
      instagram, 
      dateOfBirth: dob ? new Date(dob) : undefined, 
      profilePhoto 
    });
    res.status(201).json({ message: 'Member added successfully.', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// extract members for birthday spotlight
export const getBirthdaySpotlight = async (req, res) => {
  try {

    const today = new Date();

    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();

    const users = await User.aggregate([
      {
        $addFields: {
          birthMonth: { $month: "$dateOfBirth" },
          birthDay: { $dayOfMonth: "$dateOfBirth" }
        }
      },
      {
        $match: {
          birthMonth: currentMonth,
          birthDay: currentDay
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          profilePhoto: 1,
          events: 1,
          batch: 1,
          dateOfBirth: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};
