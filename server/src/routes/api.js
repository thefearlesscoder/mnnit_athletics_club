import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

import { loginUser } from '../controllers/authController.js';
import { getNotices, getAlumni, getEvents, getRecords, createNotice, createEvent } from '../controllers/contentController.js';
import { submitRequest, getRequests, approveRequest, rejectRequest } from '../controllers/requestController.js';
import { verifyMagicLink, getMyProfile, updateMyProfile } from '../controllers/memberController.js';

const router = express.Router();

// ─── Middleware: protect any authenticated route ──────────────────────────────
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
      req.user = await User.findById(decoded.id).select('-password');
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

// ─── Auth ─────────────────────────────────────────────────────────────────────
router.post('/auth/login', loginUser);

// ─── Public Content ───────────────────────────────────────────────────────────
router.get('/content/notices', getNotices);
router.get('/content/alumni', getAlumni);
router.get('/content/events', getEvents);
router.get('/content/records', getRecords);

// ─── Public: Submit a profile request ────────────────────────────────────────
router.post('/requests', submitRequest);

// ─── Admin: Manage profile requests ──────────────────────────────────────────
router.get('/admin/requests', protect, admin, getRequests);
router.post('/admin/requests/:id/approve', protect, admin, approveRequest);
router.post('/admin/requests/:id/reject', protect, admin, rejectRequest);

// ─── Admin: Content management ────────────────────────────────────────────────
router.post('/admin/notice', protect, admin, createNotice);
router.post('/admin/event', protect, admin, createEvent);

// ─── Member: Magic link verification & profile editing ───────────────────────
router.get('/member/verify-token', verifyMagicLink);
router.get('/member/profile', protect, getMyProfile);
router.put('/member/profile', protect, updateMyProfile);

export default router;
