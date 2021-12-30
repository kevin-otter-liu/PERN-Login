module.exports = function (req, res, next) {
  const { email, name, password } = req.body;

  // function to check if email is in valid format
  function validEmail(userEmail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  }

  // for register API
  if (req.path === '/register') {
    console.log(!email.length);

    // check there are missing credentials in the request
    if (![email, name, password].every(Boolean)) {
      return res.status(401).json('Missing Credentials');
    } else if (!validEmail(email)) {
      return res.status(401).json('Invalid Email');
    }
  }

  // for Login API
  else if (req.path === '/login') {
    if (![email, password].every(Boolean)) {
      return res.status(401).json('Missing Credentials');
    } else if (!validEmail(email)) {
      return res.status(401).json('Invalid Email');
    }
  }

  // pass to next middleware
  next();
};
