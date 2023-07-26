const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model
// set token secret and expiration date
const secret = process.env.TOKEN_SECRET || 'mysecretsshhhhh';
const expiration = process.env.TOKEN_EXPIRATION || '800h';
module.exports = {
  authMiddleware: async function ({ req }) {
    let token = req.body.token || req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return req;
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });

      // Find the user by the decoded _id
      const user = await User.findById(data._id);

      req.user = user; // Set the user object in the request context
    } catch {
      console.log('Invalid token');
    }

    return req;
  },
  signToken: function ({ name, email, _id }) {
    const payload = { name, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
