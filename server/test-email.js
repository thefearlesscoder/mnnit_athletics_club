import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

console.log("SMTP_HOST:", process.env.SMTP_HOST);
console.log("SMTP_PORT:", process.env.SMTP_PORT);
console.log("SMTP_USER:", process.env.SMTP_USER);
// hide pass

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function main() {
  try {
    console.log("Verifying connection...");
    await transporter.verify();
    console.log("Connection verified!");

    console.log("Sending test email...");
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: process.env.SMTP_USER, // Send to self
      subject: "Test Email from MAC Server",
      text: "This is a test email to verify SMTP settings.",
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error testing email:", error);
  }
}

main();
