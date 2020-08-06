const User = require('../models/user.model');
const { APIsuccess, APIerror } = require('../helpers/API-response');

class UserController {

  constructor() { }

  static async create(req, res, next) {
    try {
      if (!req.body.username || !req.body.password || !req.body.token) {
        res.status(400).send({ message: "token or username or password can not be empty!" });
        return;
      }
      const user = new User(req.body);
      const data = await user.save();
      return res.status(201).json(APIsuccess(201, data));
    } catch (error) {
      next(error);
    }
  }

  static async list(req, res, next) {
    try {
      return res.status(200).json(APIsuccess(200, await User.find()));
    } catch (error) {
      next(error);
    }
  }

  static async get(req, res, next) {
    try {
      const data = await User.findOne({ id: req.params.id });
      return data ? res.status(200).json(APIsuccess(200, data)) : res.status(404).json(APIerror(404, { message: `User not found` }));
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const data = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { useFindAndModify: false });
      return data ? res.status(200).json(APIsuccess(200, data)) : res.status(404).json(APIerror(404, { message: `User not found` }));
    } catch (error) {
      next(error);
    }
  }

  static async remove(req, res, next) {
    try {
      const data = await User.findByIdAndDelete(req.params.id);
      return data ? res.status(201).send() : res.status(404).json(APIerror(404, { message: `User not found` }));
    } catch (error) {
      next(error);
    }
  }

}

module.exports = UserController;