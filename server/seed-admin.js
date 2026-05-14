/**
 * seed-admin.js
 * Run once to create the admin user in MongoDB.
 * Usage:  node seed-admin.js
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';

dotenv.config();

const ADMIN_EMAIL = 'admin@mac.com';
const ADMIN_PASSWORD = 'admin';

const seed = async () => {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI not set in .env');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log(`Admin user already exists: ${ADMIN_EMAIL}`);
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await User.create({
    name: 'MAC Admin',
    email: ADMIN_EMAIL,
    password: hashedPassword,
    role: 'admin',
  });

  console.log(`✅ Admin user created — email: ${ADMIN_EMAIL}  password: ${ADMIN_PASSWORD}`);
  await mongoose.disconnect();
};

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
