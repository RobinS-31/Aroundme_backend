// == Import : npm
const express = require('express');
const router = express.Router();

// == Import : local
const authCtrl = require('../controllers/auth');
const imageCtrl = require('../controllers/image');
const dashboardCtrl = require('../controllers/dashboard');

router.put('/updateuser', authCtrl.checkAuthorisation, dashboardCtrl.updateUser);
router.put('/updateproducer', authCtrl.checkAuthorisation, imageCtrl.handleImageProducerAccount, dashboardCtrl.updateProducer);
router.put('/updatepasswordaccount', authCtrl.checkAuthorisation, dashboardCtrl.updatePasswordAccount);
router.put('/updateproducerproducts', authCtrl.checkAuthorisation, dashboardCtrl.updateProducerProducts);

module.exports = router;
