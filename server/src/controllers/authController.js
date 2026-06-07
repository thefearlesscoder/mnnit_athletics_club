import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Member from '../models/Member.js';
import NormalUser from '../models/NormalUser.js';
import ApprovedEmail from '../models/ApprovedEmail.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const memberLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Member.findOne({ email });
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
export const memberRegister = async (req, res) => {
  const { name, email, password, branch, batch, events, achievements, linkedIn, instagram, dateOfBirth, profilePhoto } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  try {
    // 1. Check if user already exists
    const userExists = await Member.findOne({ email });
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
    const user = await Member.create({
      name,
      email,
      password: hashedPassword,
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
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const editMemberProfile = async (req, res) => { // not working
  try {
    const userId = req.user.id;

    const user = await Member.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const {
      name,
      email,
      password,
      branch,
      batch,
      linkedIn,
      instagram,
      dateOfBirth,
      birthday,
      events,
      achievements,
      profilePhoto,
    } = req.body;

    // Upload image if present
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "profile-photos",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        streamifier
          .createReadStream(req.file.buffer)
          .pipe(stream);
      });

      user.profilePhoto = uploadResult.secure_url;
    } else if (profilePhoto !== undefined) {
      user.profilePhoto = profilePhoto;
    }

    if (name) user.name = name;

    if (email && email !== user.email) {
      const existing = await User.findOne({ email });

      if (existing) {
        return res.status(400).json({
          message: "Email already exists",
        });
      }

      user.email = email;
    }

    if (role) user.role = role;
    if (branch !== undefined) user.branch = branch;
    if (batch !== undefined) user.batch = batch;

    if (linkedIn !== undefined)
      user.linkedIn = linkedIn;

    if (instagram !== undefined)
      user.instagram = instagram;

    const dob = dateOfBirth || birthday;
    if (dob !== undefined)
      user.dateOfBirth = dob ? new Date(dob) : undefined;

    if (events !== undefined) {
      if (Array.isArray(events)) {
        user.events = events;
      } else if (typeof events === 'string') {
        try {
          const parsed = JSON.parse(events);
          user.events = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          user.events = events.split(',').map(e => e.trim()).filter(Boolean);
        }
      }
    }

    if (achievements !== undefined) {
      if (Array.isArray(achievements)) {
        user.achievements = achievements;
      } else if (typeof achievements === 'string') {
        try {
          const parsed = JSON.parse(achievements);
          user.achievements = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          user.achievements = achievements.split(',').map(a => a.trim()).filter(Boolean);
        }
      }
    }

    if (password) {
      user.password = await bcrypt.hash(
        password,
        10
      );
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Normal user controller------


// sighup normal user
export const normalUserSignUp = async(req, res) => {
    try {
      const {name, email, password, phoneNumber, registrationNumber, batch, branch} = req.body;

      if(!name || !email || !password || !phoneNumber || !registrationNumber) {
        return res.status(400).json({
          message: "All marked fields are required"
        });
      }

      const existingNormalUser = await NormalUser.findOne({ email });
      const existingMember = await Member.findOne({ email });

      if(existingNormalUser || existingMember) {
        return res.status(400).json({
          message: "User already exists"
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await NormalUser.create({
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        registrationNumber,
        batch,
        branch,
      });

      res.status(201).json({
        message: "Registration successful! You can now log in.",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
}


// login normal user
export const normalUserLogin = async(req, res) => {
  try {
    const {email, password} = req.body;
    
    if(!email || !password){
      return res.status(400).json({
        message: "All marked fields are required"
      });
    }

    const user = await NormalUser.findOne({ email });

    if(!user){
      return res.status(404).json({
        message: "User not found"
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if(!isPasswordValid){
      return res.status(401).json({
        message: "Invalid password"
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export const normalUserEditProfile = async(req, res) =>{

}

// edit profile normal user