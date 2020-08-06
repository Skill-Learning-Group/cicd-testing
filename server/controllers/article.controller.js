const Article = require('../models/article.model');
const { APIsuccess, APIerror } = require('../helpers/API-response');

class ArticleController {

  constructor() { }

  static async create(req, res, next) {
    try {
      if (!req.body.title || !req.body.content || !req.body.token) {
        res.status(400).send({ message: "title or content or token can not be empty!" });
        return;
      }
      const article = new Article(req.body);
      const data = await article.save();
      return res.status(201).json(APIsuccess(201, data));
    } catch (error) {
      next(error);
    }
  }

  static async list(req, res, next) {
    try {
      return res.status(200).json(APIsuccess(200, await Article.find()));
    } catch (error) {
      next(error);
    }
  }

  static async get(req, res, next) {
    try {
      const data = await Article.findOne({ id: req.params.id });
      return data ? res.status(200).json(APIsuccess(200, data)) : res.status(404).json(APIerror(404, { message: `Article not found` }));
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const data = await Article.findByIdAndUpdate(req.params.id, { $set: req.body }, { useFindAndModify: false });
      return data ? res.status(200).json(APIsuccess(200, data)) : res.status(404).json(APIerror(404, { message: `Article not found` }));
    } catch (error) {
      next(error);
    }
  }

  static async remove(req, res, next) {
    try {
      const data = await Article.findByIdAndDelete(req.params.id);
      return data ? res.status(201).send() : res.status(404).json(APIerror(404, { message: `Article not found` }));
    } catch (error) {
      next(error);
    }
  }

}

module.exports = ArticleController;