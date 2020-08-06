const express = require('express');
const { APIsuccess, APIerror } = require('./helpers/API-response');
const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');
const articleRoutes = require('./routes/article.route');

const router = express.Router();

router.get('/', (req, res) => { res.status(200).json(APIsuccess(200)); });
router.use('/', authRoutes);
const jwt = require('jsonwebtoken');

router.use(async (req, res, next) => {
  try {
    const token = req.body.token;
    await jwt.verify(token, 'shhhhh');
    next();
  } catch (err) {
    return res.status(401).json(APIerror(401, { message: err.message }))
  }
});

router.use('/users', userRoutes);
router.use('/articles', articleRoutes);

module.exports = router;
