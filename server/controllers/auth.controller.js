const User = require('../models/user.model');
const { APIsuccess, APIerror } = require('../helpers/API-response');
const jwt = require('jsonwebtoken');

class AuthController {

  constructor() { }

  static async login(req, res, next) {
    try {
      if (!req.body.username || !req.body.password) {
        res.status(400).send(APIerror(400, { message: "username or password can not be empty!" }));
        return;
      }
      const user = await User.findOne({ username: req.body.username, password: req.body.password });
      console.log(user);
      if (!user) return res.status(400).json(APIerror(400, { message: 'invalid user' }));

      const token = jwt.sign(JSON.parse(JSON.stringify(user)), 'shhhhh');
      return res.status(200).json(APIsuccess(200, { token }));
    } catch (error) {
      next(error);
    }
  }

}

module.exports = AuthController;