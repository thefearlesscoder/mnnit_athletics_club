import crypto from 'crypto';
import nodemailer from 'nodemailer';
import LoginRequest from '../models/LoginRequest.js';
import User from '../models/User.js';

// ─── Nodemailer transporter ───────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const ADMIN_EMAIL = process.env.SMTP_USER; // Admin gets notified at the club email
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// ─── Helper: send email ───────────────────────────────────────────────────────
const sendMail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    html,
  });
};

// ─── PUBLIC: Submit a new profile request ────────────────────────────────────
// POST /api/v1/requests
export const submitRequest = async (req, res) => {
  const { name, email, role, message } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required.' });
  }

  try {
    // Prevent duplicate pending requests from the same email
    const existing = await LoginRequest.findOne({ email, status: 'pending' });
    if (existing) {
      return res
        .status(409)
        .json({ message: 'A pending request already exists for this email.' });
    }

    const request = await LoginRequest.create({
      name,
      email,
      role: role || 'member',
      message,
    });

    // Notify admin by email
    await sendMail({
      to: ADMIN_EMAIL,
      subject: `[MAC] New Profile Request from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
          <h2 style="color: #3b82f6;">New Profile Request</h2>
          <p>A new request to add/edit a profile has been submitted on the MAC website.</p>
          <table style="border-collapse: collapse; width: 100%;">
            <tr><td style="padding: 8px; font-weight: bold;">Name</td><td style="padding: 8px;">${name}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding: 8px; font-weight: bold;">Email</td><td style="padding: 8px;">${email}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Role</td><td style="padding: 8px; text-transform: capitalize;">${role || 'member'}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding: 8px; font-weight: bold;">Message</td><td style="padding: 8px;">${message || '—'}</td></tr>
          </table>
          <p style="margin-top: 1.5rem;">
            <a href="${CLIENT_URL}/admin" style="background: #3b82f6; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">
              Review on Dashboard →
            </a>
          </p>
          <p style="color: #888; font-size: 0.85rem; margin-top: 2rem;">MNNIT Athletics Club · Admin Portal</p>
        </div>
      `,
    });

    res.status(201).json({ message: 'Request submitted successfully. Admin will review it shortly.' });
  } catch (error) {
    console.error('[submitRequest]', error.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// ─── ADMIN: Get all pending requests ─────────────────────────────────────────
// GET /api/v1/admin/requests
export const getRequests = async (req, res) => {
  try {
    const requests = await LoginRequest.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── ADMIN: Approve a request ─────────────────────────────────────────────────
// POST /api/v1/admin/requests/:id/approve
export const approveRequest = async (req, res) => {
  try {
    const request = await LoginRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found.' });
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'This request has already been processed.' });
    }

    // Generate a secure random token (valid for 2 hours)
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiry = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours

    // Create a placeholder user if one doesn't exist yet
    let user = await User.findOne({ email: request.email });
    if (!user) {
      user = new User({
        name: request.name,
        email: request.email,
        role: request.role,
        // Temporary password — user sets their own via the magic link flow
        password: crypto.randomBytes(16).toString('hex'),
      });
    }
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = expiry;
    await user.save();

    // Mark request as approved
    request.status = 'approved';
    await request.save();

    // Send magic link to the requester
    const magicLink = `${CLIENT_URL}/member-portal?token=${rawToken}`;
    await sendMail({
      to: request.email,
      subject: '✅ [MAC] Your Profile Access Has Been Approved',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
          <h2 style="color: #10b981;">You're In! 🎉</h2>
          <p>Hi <strong>${request.name}</strong>,</p>
          <p>Your request to add/edit your profile on the MNNIT Athletics Club website has been <strong>approved</strong>.</p>
          <p>Click the button below to access your profile editor. This link expires in <strong>2 hours</strong>.</p>
          <p style="margin: 2rem 0;">
            <a href="${magicLink}" style="background: #3b82f6; color: white; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 1rem;">
              Edit My Profile →
            </a>
          </p>
          <p style="color: #888; font-size: 0.85rem;">If you did not request this, you can safely ignore this email.</p>
          <p style="color: #888; font-size: 0.85rem; margin-top: 2rem;">MNNIT Athletics Club</p>
        </div>
      `,
    });

    res.json({ message: `Request approved. Magic link sent to ${request.email}.` });
  } catch (error) {
    console.error('[approveRequest]', error.message);
    res.status(500).json({ message: error.message });
  }
};

// ─── ADMIN: Reject a request ──────────────────────────────────────────────────
// POST /api/v1/admin/requests/:id/reject
export const rejectRequest = async (req, res) => {
  try {
    const request = await LoginRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found.' });
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'This request has already been processed.' });
    }

    request.status = 'rejected';
    await request.save();

    // Notify the requester of rejection
    await sendMail({
      to: request.email,
      subject: '[MAC] Profile Request Update',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
          <h2 style="color: #ef4444;">Profile Request Update</h2>
          <p>Hi <strong>${request.name}</strong>,</p>
          <p>Thank you for reaching out to the MNNIT Athletics Club. After reviewing your request, we were <strong>unable to verify your membership</strong> at this time.</p>
          <p>If you believe this is a mistake or would like to provide more information, please contact us directly.</p>
          <p style="color: #888; font-size: 0.85rem; margin-top: 2rem;">MNNIT Athletics Club · mnnitathleticsclub@gmail.com</p>
        </div>
      `,
    });

    res.json({ message: `Request rejected. Notification sent to ${request.email}.` });
  } catch (error) {
    console.error('[rejectRequest]', error.message);
    res.status(500).json({ message: error.message });
  }
};
