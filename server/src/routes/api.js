import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/Member.js';
import Admin from '../models/Admin.js';

import { editMemberProfile, memberLogin, memberRegister, normalUserEditProfile, normalUserLogin, normalUserSignUp, adminLogin } from '../controllers/authController.js';
import { getAllNotices, getNotices, getAlumni, getAllMembers, getEvents, getRecords, createNotice, createEvent, editNotice, deleteNotice, editEvent, deleteEvent, getGalleryImages } from '../controllers/contentController.js';
import { submitRequest, getRequests, approveRequest, rejectRequest, getApprovedEmails } from '../controllers/requestController.js';
import { getBirthdaySpotlight, addMember } from '../controllers/memberController.js';
import { upload, uploadImages } from '../controllers/uploadController.js';
import NormalUser from '../models/NormalUser.js';
import { getFeedbacks, submitFeedback } from '../controllers/feedback.js';

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

const protectAdmin = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await Admin.findById(decoded.id).select('-password');
      if (req.user) {
        next();
      } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
      }
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
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

// Admin auth routes
router.post('/auth/admin/login', adminLogin);

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
router.get('/content/gallery', getGalleryImages);

router.get('/content/birthday-spotlight', getBirthdaySpotlight);

router.post('/add-members', addMember);

//Public: Submit a profile request 
router.post('/request', submitRequest);

// feed back
router.post('/feedback', submitFeedback);
router.get('/admin/get_all_feedback', protectAdmin, getFeedbacks);

// Admin: Manage profile requests 
router.get('/admin/requests', protectAdmin, getRequests);
router.post('/admin/requests/:id/approve', protectAdmin, approveRequest);
router.post('/admin/requests/:id/reject', protectAdmin, rejectRequest);
router.get('/admin/approved-emails', protectAdmin, getApprovedEmails);

//Admin: Content management 
router.get('/admin/notices', protectAdmin, getAllNotices);
router.post('/admin/notice', protectAdmin, createNotice);
router.put('/admin/notice/edit/:id', protectAdmin, editNotice);
router.post('/admin/notice/delete/:id', protectAdmin, deleteNotice);

router.post('/admin/event', protectAdmin, createEvent);
router.put('/admin/event/edit/:id', protectAdmin, editEvent);
router.post('/admin/event/delete/:id', protectAdmin, deleteEvent);

// Admin: Cloudinary Multi-image Upload
router.post('/admin/gallery/upload', protectAdmin, upload.any(), uploadImages);

// add records routes (schema not decided yet (maybe pdf display or in app display))

// Member: Magic link verification & profile editing
// router.get('/member/verify-token', verifyMagicLink);
// router.get('/member/profile', protect, getMyProfile);
// router.put('/member/profile', protect, updateMyProfile);

export default router;
