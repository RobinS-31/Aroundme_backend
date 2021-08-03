// == Import : npm
const express = require('express');
const router = express.Router();

// == Import : local
const producerCtrl = require('../controllers/producers');

router.get('/getproducer', producerCtrl.getProducers);
router.get('/getoneproducer/:id', producerCtrl.getOneProducer);

module.exports = router;
