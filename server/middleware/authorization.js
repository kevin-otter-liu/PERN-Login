const jwt = require('jsonwebtoken');
require('dotenv').config();

// even before it hits the routes, this middle ware is run

module.exports = async (req, res, next) => {
  try {
    // 1. destructure the token in the header
    const jwtToken = req.header('token');

    if (!jwtToken) {
      return res.status(403).json('Not Authorized');
    }

    // 2. verify the jwt token with our jwtSecret
    // verify will return the payload which we can use as data to be passed
    // to the next function by attaching to the same request object
    const payload = jwt.verify(jwtToken, process.env.jwtSecret);

    req.user = payload.user;
  } catch (error) {
    console.error(error.message);
    return res.status(403).json('Not Authorized');
  }
};
