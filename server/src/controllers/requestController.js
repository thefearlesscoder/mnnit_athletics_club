import crypto from 'crypto';
import nodemailer from 'nodemailer';
import LoginRequest from '../models/LoginRequest.js';
import Member from '../models/Member.js';
import ApprovedEmail from '../models/ApprovedEmail.js';

// ─── Nodemailer transporter
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
const CLIENT_URL = process.env.CLIENT_URL;

// ─── Helper: send email 
const sendMail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    html,
  }); 
};

// POST /api/v1/request
export const submitRequest = async (req, res) => {
  const { name, email, role, batch, message } = req.body;
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

    // if user already approved navigate it to signup / login 
    const approved = await ApprovedEmail.findOne({ email});
    if(approved){
      return res.status(400).json({ message: 'This email is already approved. You can log in or sign up now' });
    }
    
    const request = await LoginRequest.create({
      name,
      email,
      batch,
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
            <tr style="background:#f9f9f9"><td style="padding: 8px; font-weight: bold;">Batch</td><td style="padding: 8px;">${batch || '—'}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Message</td><td style="padding: 8px;">${message || '—'}</td></tr>
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

// ─── ADMIN: Get all pending requests 
// GET /api/v1/admin/requests
export const getRequests = async (req, res) => {
  try {
    const requests = await LoginRequest.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── ADMIN: Approve a request
// POST /api/v1/admin/requests/:id/approve
export const approveRequest = async (req, res) => {
  try {
    const request = await LoginRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found.' });
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'This request has already been processed.' });
    }

    // handling duplicates gracefully)
    let approved = await ApprovedEmail.findOne({ email: request.email });
    if (!approved) {
      approved = await ApprovedEmail.create({
        email: request.email,
        addedBy: req.user._id,
      });
    }
    
    //Mark request as approved
    request.status = 'approved';
    await request.save();

    //Send notification email to the requester
    const signUpLink = `${CLIENT_URL}/register`;
    await sendMail({
      to: request.email,
      subject: '✅ [MAC] Your Registration Request Has Been Approved',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
          <h2 style="color: #10b981;">Your Request is Approved! 🎉</h2>
          <p>Hi <strong>${request.name}</strong>,</p>
          <p>Your request to register on the MNNIT Athletics Club website has been approved by the admin.</p>
          <p>You can now sign up and create your account using your email (<strong>${request.email}</strong>).</p>
          <p style="margin: 2rem 0;">
            <a href="${signUpLink}" style="background: #3b82f6; color: white; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 1rem;">
              Sign Up Now →
            </a>
          </p>
          <p style="color: #888; font-size: 0.85rem;">MNNIT Athletics Club</p>
        </div>
      `,
    });

    res.json({ message: `Request approved. Notification email sent to ${request.email}.` });
  } catch (error) {
    console.error('[approveRequest]', error.message);
    res.status(500).json({ message: error.message });
  }
};

// ─── ADMIN: Reject a request 
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

// ─── ADMIN: Get all whitelisted emails 
// GET /api/v1/admin/approved-emails
export const getApprovedEmails = async (req, res) => {
  try {
    const emails = await ApprovedEmail.find({}).sort({ createdAt: -1 });
    res.json(emails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
