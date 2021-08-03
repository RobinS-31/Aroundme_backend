// == Import : npm
const express = require('express');
const router = express.Router();

// == Import : local
const categoryCtrl = require('../controllers/category');

router.get('/getcategories', categoryCtrl.getCategories);

module.exports = router;
