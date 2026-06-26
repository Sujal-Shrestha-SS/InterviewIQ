const User = require('../models/user.model');
const generateToken = require('../utils/generateToken');
const { asyncHandler } = require('../middleware/error.middleware');

// POST /api/auth/register

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //Check if email already used
  const existingUser = await User.findOne({ email});
  if (existingUser) {
    return res.status(400).json({
        success: false,
        message: 'Email already in use'
    });
}

// Create the user (password gets hashed by the model's pre-save hook)
const user = await User.create({
    name,
    email,
    password_hash: password
});

const token = generateToken(user._id);

res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: {
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        token
        }
    })
})