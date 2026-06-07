import Member from '../models/Member.js';
import LoginRequest from '../models/LoginRequest.js';
import ApprovedEmail from '../models/ApprovedEmail.js';

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
