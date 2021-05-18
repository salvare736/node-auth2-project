const bcrypt = require('bcryptjs');
const router = require("express").Router();
const { checkUsernameExists, validateRoleName } = require('./auth-middleware');
const tokenBuilder = require('../secrets/index');

router.post("/register", validateRoleName, (req, res, next) => {
  /**
    [POST] /api/auth/register { "username": "anna", "password": "1234", "role_name": "angel" }

    response:
    status 201
    {
      "user"_id: 3,
      "username": "anna",
      "role_name": "angel"
    }
   */
});

router.post("/login", checkUsernameExists, (req, res, next) => {
  if (bcrypt.compareSync(req.body.password, req.user.password)) {
    const token = tokenBuilder(req.user)
    res.json({
      message: `${req.user.username} is back!`,
      token: token
    })
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
    customMessage: 'Something went wrong inside the auth router'
  });
});

module.exports = router;
