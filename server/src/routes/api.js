import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/Member.js';

import { editMemberProfile, memberLogin, memberRegister, normalUserEditProfile, normalUserLogin, normalUserSignUp } from '../controllers/authController.js';
import { getNotices, getAlumni, getAllMembers, getEvents, getRecords, createNotice, createEvent, editNotice, deleteNotice, editEvent, deleteEvent } from '../controllers/contentController.js';
import { submitRequest, getRequests, approveRequest, rejectRequest, getApprovedEmails } from '../controllers/requestController.js';
import { getBirthdaySpotlight, addMember } from '../controllers/memberController.js';
import { upload, uploadImages } from '../controllers/uploadController.js';
import NormalUser from '../models/NormalUser.js';

const router = express.Router();

// ─── Middleware: protect any authenticated route ──────────────────────────────
const protectMember = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) { res.status(401).json({ message: 'Not authorized, no token' }); }
};

const protectNormalUser = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await NormalUser.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) { res.status(401).json({ message: 'Not authorized, no token' }); }
};

// ─── Middleware: admin only ───────────────────────────────────────────────────
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

// Member auth routes
router.post('/auth/login', memberLogin);
router.post('/auth/register', memberRegister);
router.put('/profile/:id/edit', protectMember, editMemberProfile)

// normal user routes
router.post('/auth/normal_user/login', normalUserLogin);
router.post('/auth/normal_user/signup', normalUserSignUp);
router.put('/auth/normal_user/editProfile', protectNormalUser, normalUserEditProfile);

//Public Content
router.get('/content/notices', getNotices);
router.get('/content/alumni', getAlumni);
router.get('/content/members', getAllMembers);
router.get('/content/events', getEvents);
router.get('/content/records', getRecords);

router.get('/content/birthday-spotlight', getBirthdaySpotlight);

router.post('/add-members', addMember);

//Public: Submit a profile request 
router.post('/request', submitRequest);

// Admin: Manage profile requests 
router.get('/admin/requests', protectMember, admin, getRequests);
router.post('/admin/requests/:id/approve', protectMember, admin, approveRequest);
router.post('/admin/requests/:id/reject', protectMember, admin, rejectRequest);
router.get('/admin/approved-emails', protectMember, admin, getApprovedEmails);

//Admin: Content management 
router.post('/admin/notice', protectMember, admin, createNotice);
router.put('/admin/notice/edit/:id', protectMember, admin, editNotice);
router.post('/admin/notice/delete/:id', protectMember, admin, deleteNotice);

router.post('/admin/event', protectMember, admin, createEvent);
router.put('/admin/event/edit/:id', protectMember, admin, editEvent);
router.post('/admin/event/delete/:id', protectMember, admin, deleteEvent);

// Admin: Cloudinary Multi-image Upload
router.post('/admin/gallery/upload', protectMember, admin, upload.any(), uploadImages);

// add records routes (schema not decided yet (maybe pdf display or in app display))

// Member: Magic link verification & profile editing
// router.get('/member/verify-token', verifyMagicLink);
// router.get('/member/profile', protect, getMyProfile);
// router.put('/member/profile', protect, updateMyProfile);

export default router;
