require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User.model');

const test = async () => {
  await connectDB();

  // Create a test user
  const user = await User.create({
    name: 'Test User',
    email: 'test@test.com',
    password_hash: 'password123'
  });

  console.log('Created user:', user);
  console.log('Password stored as hash:', user.password_hash);

  // Verify password matching works
  const userWithPass = await User.findById(user._id).select('+password_hash');
  const isMatch = await userWithPass.matchPassword('password123');
  console.log('Password match:', isMatch);  // should be true

  const isWrong = await userWithPass.matchPassword('wrongpassword');
  console.log('Wrong password:', isWrong); // should be false

  // Clean up
  await User.deleteOne({ _id: user._id });
  console.log('Test passed. User deleted.');
  process.exit(0);
};

test().catch(console.error);