import nodemailer from 'nodemailer';
import Feedback from "../models/Feedback.js";

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

// ─── Helper: send email 
const sendMail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    html,
  }); 
};

export const submitFeedback = async(req, res) => {
    const {name, email, message}  = req.body;

    if(!name || !email || !message){
        return res.status(400).json({message: "All fields are required"});
    }

    try{
        const feedback = await Feedback.create({name, email, message});
        
        // Notify admin by email
        await sendMail({
          to: ADMIN_EMAIL,
          subject: `[MAC] New Feedback from ${name}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
              <h2 style="color: #3b82f6;">New Feedback Submitted</h2>
              <p>A new feedback has been submitted on the MAC website.</p>
              <table style="border-collapse: collapse; width: 100%;">
                <tr><td style="padding: 8px; font-weight: bold;">Name</td><td style="padding: 8px;">${name}</td></tr>
                <tr style="background:#f9f9f9"><td style="padding: 8px; font-weight: bold;">Email</td><td style="padding: 8px;">${email}</td></tr>
                <tr><td style="padding: 8px; font-weight: bold;">Message</td><td style="padding: 8px;">${message}</td></tr>
              </table>
              <p style="color: #888; font-size: 0.85rem; margin-top: 2rem;">MNNIT Athletics Club</p>
            </div>
          `,
        });

        res.status(201).json({message: "Feedback submitted successfully"});
    } catch(error){
        console.error('[submitFeedback]', error.message);
        res.status(500).json({message: "Failed to submit feedback", error: error.message});
    }
};

export const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('[getFeedbacks]', error.message);
    res.status(500).json({ message: "Failed to fetch feedbacks", error: error.message });
  }
};
      