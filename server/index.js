const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json()); //req.body
app.use(cors());

// ROUTES

//register and login ROUTES
app.use('/auth', require('./routes/jwtAuth'));

//register dashboard ROUTES
app.use('/dashboard', require('./routes/dashboard'));

app.listen(5000, () => {
  console.log('server is running on port 5000');
});
