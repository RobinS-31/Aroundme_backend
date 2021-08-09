// == Import : npm
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// == Import : local
const User = require('../models/User');
const Producer = require('../models/Producer');

exports.updateProducer = async (req, res, next) => {
    console.log("updateProducer");
    res.status(200).send();
};
