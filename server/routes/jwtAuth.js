const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwtGenerator = require('../utils/jwtGenerator');

// middleware
const validInfo = require('../middleware/validInfo');
const authorization = require('../middleware/authorization');

//register API
// validInfo is the middleware to run before hitting the routes
router.post('/register', validInfo, async (req, res, next) => {
  try {
    // 1 destructure the req.body (name, email, password)

    const { name, email, password } = req.body;

    // 2. Check if user exist (if user exist then throw error)

    const user = await pool.query('SELECT * FROM users WHERE user_email=$1', [
      email,
    ]);

    //401 is unauthenticated and 403 is unauthorized
    if (user.rows.length !== 0) {
      return res.status(401).send('User already exists');
    }

    // 3. Bcrypt the user user_password

    // how many rounds of salt -- read bcrypt documentation
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);

    // hash the password with the salt generated to get the encrypted password
    const bcryptPassword = await bcrypt.hash(password, salt);

    // 4. enter the new user inside our DATABASE
    const newUser = await pool.query(
      'INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, bcryptPassword]
    );

    // 5. generating our jwt token
    const token = jwtGenerator(newUser.rows[0].user_id);

    res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// Login route
router.post('/login', validInfo, async (req, res) => {
  try {
    // 1. destructure request body

    const { email, password } = req.body;
    // 2. check if user doesn't exist (if it doesnt, throw error)
    const user = await pool.query('SELECT * FROM users WHERE user_email = $1', [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json('Password or Email is incorrect');
    }

    // 3. check if user exists, is incoming password the same as the database passwords
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    // 4. give them the jwt generator token
    const token = jwtGenerator(user.rows[0].user_id);
    res.json({ token });

    if (!validPassword) {
      return res.status(401).json('Password or Email is incorrect');
    }

    // 4. give them the jwt token
  } catch (error) {
    console.error(error.message);
  }
});

// check whether the user is verified during refresh etc...
router.get('/is-verify', authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (error) {
    console.error(error.message);
  }
});
// create a router
module.exports = router;
