// == Import : npm
const express = require('express');
const router = express.Router();

// == Import : local
const productCtrl = require('../controllers/product');

router.get('/getproducts', productCtrl.getProducts);

module.exports = router;
