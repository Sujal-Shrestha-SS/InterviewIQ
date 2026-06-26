const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign(
    { id },                          // payload — what's inside the token
    process.env.JWT_SECRET,          // secret key used to sign it
    { expiresIn: process.env.JWT_EXPIRE || '7d' }  // expiry
  );
};

module.exports = generateToken;