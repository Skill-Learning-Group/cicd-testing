const express = require('express');
const userController = require('../controllers/user.controller');
const router = express.Router();

router.route('/').post(userController.create);
router.route('/').get(userController.list);
router.route('/:id').get(userController.get);
router.route('/:id').put(userController.update);
router.route('/:id').delete(userController.remove);

module.exports = router;