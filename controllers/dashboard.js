// == Import : npm
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// == Import : local
const User = require('../models/User');
const Producer = require('../models/Producer');

exports.updateProducer = async (req, res, next) => {
    const dataFile = req.datafile;
    const producerData = JSON.parse(req.body.producerData);
    const { userId } = producerData;
    delete producerData.xsrfToken;
    delete producerData.userId;

    if (req.files.length !== 0) {
        producerData.imageUrl = [
            `images/producers/${dataFile.objectId}/${dataFile.fileName}_h600.webp`,
            `images/producers/${dataFile.objectId}/${dataFile.fileName}_h140.webp`,
        ];
    }

    const updateProducer = await Producer.findByIdAndUpdate(
        userId,
        {
            ...producerData,
            updatedAt: new Date()
        },
        {
            new: true,
            runValidators: true
        }
    );

    if (!updateProducer) {
        return res.status(400).json({ error: 'no match ID' });
    }

    const producerInfo = { ...updateProducer._doc }
    delete producerInfo.password;
    delete producerInfo.__v;

    res.status(200).json(producerInfo);
};
