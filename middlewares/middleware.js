let jwt = require('jsonwebtoken');
const config = require('./config.js');


module.exports = {
  verifytoken(req, res, next) {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token) {
      if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
      }
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          console.log("token Expired!")

          return res.status(200).json({
            success: false,
            message: 'Token is not valid',
            error: err.toString()
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.status(200).json({
        success: false,
        message: 'Auth token is not supplied'
      });
    }
  },

}