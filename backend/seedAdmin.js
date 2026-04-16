require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Direct connection - NO EXPRESS
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/thefolio';

// Create a temporary schema for seeding only
const tempUserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  status: String,
  bio: String,
  profilePic: String
}, { timestamps: true });

// Add hashing directly in the seed function, not in schema
const TempUser = mongoose.model('TempUser', tempUserSchema);

const seedAdmin = async () => {
  try {
    console.log('📦 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB Connected: 127.0.0.1');
    console.log('📦 Database Name: thefolio');
    console.log('✅ Connected to MongoDB successfully!\n');

    // Check if admin exists in the actual users collection
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    const existingAdmin = await usersCollection.findOne({ email: 'admin@thefolio.com' });
    
    if (existingAdmin) {
      console.log('📌 Admin account already exists.');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 Email: admin@thefolio.com');
      console.log('🔑 Password: Admin@1234');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      await mongoose.disconnect();
      process.exit(0);
    }
    
    // Hash the password manually
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@1234', salt);
    
    // Create admin user directly using MongoDB driver
    const result = await usersCollection.insertOne({
      name: 'TheFolio Admin',
      email: 'admin@thefolio.com',
      password: hashedPassword,
      role: 'admin',
      status: 'active',
      bio: 'Coffee Center Administrator',
      profilePic: '',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    if (result.insertedId) {
      console.log('✅ Admin account created successfully!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 Email: admin@thefolio.com');
      console.log('🔑 Password: Admin@1234');
      console.log('👤 Name: TheFolio Admin');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n✨ You can now login with these credentials.');
    } else {
      console.log('❌ Failed to create admin account');
    }
    
    await mongoose.disconnect();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error creating admin account:', error.message);
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
};

seedAdmin();