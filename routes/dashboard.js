// == Import : npm
const express = require('express');
const router = express.Router();

// == Import : local
const authCtrl = require('../controllers/auth');
const imageCtrl = require('../controllers/image');
const dashboardCtrl = require('../controllers/dashboard');

router.put('/updateproducer', authCtrl.checkAuthorisation, imageCtrl.handleImageProducerAccount, dashboardCtrl.updateProducer);

module.exports = router;
