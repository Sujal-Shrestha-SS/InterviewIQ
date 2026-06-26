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

// POST /api/auth/login

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user - include password_hash (it's select: false by default)
    const user = await User.findOne({ email}).select('+password_hash');

    if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        });
    }

    const token = generateToken(user._id);

    res.json({
        success: true,
        message: 'Login successful',
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

// GET /api/auth/me  (protected)
const getMe = asyncHandler(async (req, res) => {
  // req.user was set by the protect middleware
  res.json({
    success: true,
    data: { user: req.user }
  });
});

// POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  // JWT is stateless — logout just confirms on the server side
  // The real logout happens on the frontend by deleting the token
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = { register, login, getMe, logout };