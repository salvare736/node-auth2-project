const bcrypt = require('bcryptjs');
const router = require("express").Router();
const { checkUsernameExists, validateRoleName } = require('./auth-middleware');
const tokenBuilder = require('../secrets/index');
const Users = require('../users/users-model');

router.post("/register", validateRoleName, (req, res, next) => {
  const { username, password } = req.body;
  const hash = bcrypt.hashSync(
    password,
    8
  );
  Users.add({ username, password: hash, role_name: req.role_name })
    .then(createdUser => {
      res.status(201).json(createdUser[0]);
    })
    .catch(err => {
      next(err);
    })
});

router.post("/login", checkUsernameExists, (req, res, next) => {
  if (bcrypt.compareSync(req.body.password, req.user.password)) {
    const token = tokenBuilder(req.user)
    res.json({
      message: `${req.user.username} is back!`,
      token: token
    })
  } else {
    next({ status: 401, message: 'Invalid credentials' });
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
