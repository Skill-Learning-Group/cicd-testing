const express = require('express');
const articleController = require('../controllers/article.controller');
const router = express.Router();

router.route('/').post(articleController.create);
router.route('/').get(articleController.list);
router.route('/:id').get(articleController.get);
router.route('/:id').put(articleController.update);
router.route('/:id').delete(articleController.remove);

module.exports = router;