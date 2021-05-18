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
  /*
    If the user does not provide a token in the Authorization header with a role_name
    inside its payload matching the role_name passed to this function as its argument:
    status 403
    {
      "message": "This is not for you"
    }

    Pull the decoded token from the req object, to avoid verifying it again!
  */
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
  /*
    If the role_name in the body is valid, set req.role_name to be the trimmed string and proceed.

    If role_name is missing from req.body, or if after trimming it is just an empty string,
    set req.role_name to be 'student' and allow the request to proceed.

    If role_name is 'admin' after trimming the string:
    status 422
    {
      "message": "Role name can not be admin"
    }

    If role_name is over 32 characters after trimming the string:
    status 422
    {
      "message": "Role name can not be longer than 32 chars"
    }
  */
}

module.exports = {
  restricted,
  checkUsernameExists,
  validateRoleName,
  only,
}
