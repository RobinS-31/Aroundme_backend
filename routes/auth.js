// == Import : npm
const express = require('express');
const router = express.Router();

// == Import : local
const authCtrl = require('../controllers/auth');
const imageCtrl = require('../controllers/image');

router.get('/checkediflogged', authCtrl.checkediflogged);
router.get('/logout', authCtrl.logout);
router.post('/login', authCtrl.login);
router.post('/createUser', authCtrl.checkEmailExist, authCtrl.createUser);
router.post('/createProducer', authCtrl.checkEmailExist, imageCtrl.handleImageCreateProducer, authCtrl.createProducer);

module.exports = router;
