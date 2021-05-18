const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../config");
const Users = require('../users/users-model');

const restricted = (req, res, next) => {
  const token = req.headers.authorization
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        next({ status: 401, message: 'Token invalid' });
      } else {
        req.decodedJwt = decoded;
        next();
      }
    });
  } else {
    next({ status: 401, message: 'Token required' });
  }
}

const only = role_name => (req, res, next) => {
  if (req.decodedJwt.role_name === role_name) {
    next();
  } else {
    next({ status: 403, message: 'This is not for you' });
  }
}

const checkUsernameExists = (req, res, next) => {
  const { username } = req.body;
  Users.findBy({ username })
    .then(([user]) => {
      if (user) {
        req.user = user;
        next();
      } else {
        next({ status: 401, message: 'Invalid credentials' });
      }
    })
    .catch(err => {
      next(err);
    });
}

const validateRoleName = (req, res, next) => {
  let { role_name } = req.body;
  const valid = Boolean(typeof role_name === 'string');
  if (valid) {
    req.role_name = role_name.trim();
    if (req.role_name.length === 0) {
      req.role_name = 'student';
      next();
    } else if (req.role_name.length > 32) {
      next({ status: 422, message: 'Role name can not be longer than 32 chars'  });
    } else if (req.role_name === 'admin') {
      next({ status: 422, message: 'Role name can not be admin' });
    } else {
      next();
    }
  } else {
    next({ status: 422, message: 'Role name should be a string' });
  }
}

module.exports = {
  restricted,
  checkUsernameExists,
  validateRoleName,
  only,
}
