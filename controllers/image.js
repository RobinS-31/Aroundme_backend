// == Import : npm
const mongoose = require('mongoose');
const sharp = require('sharp');
const fs = require('fs/promises');
const path = require('path');

// == Import : local
const upload = require('../config/multer');

exports.handleImageCreateProducer = async (req, res, next) => {
    try {
        const objectId = mongoose.Types.ObjectId();
        await fs.mkdir(path.join(process.cwd(), `images/producers/${objectId}`))

        const name = req.files[0].originalname.split(' ').join('_');
        const fileName = name.split('.')[0];

        const sharpStream = sharp(req.files[0].buffer,{
            failOnError: false,
            density: 96
        });

        const promises = [];
        promises.push(
            sharpStream
                .clone()
                .resize({ height: 600 })
                .webp({ quality: 80 })
                .toFile(path.join(process.cwd(), `images/producers/${objectId}/${fileName}_h600.webp`))
        );
        promises.push(
            sharpStream
                .clone()
                .resize({ height: 140 })
                .webp({ quality: 80 })
                .toFile(path.join(process.cwd(), `images/producers/${objectId}/${fileName}_h140.webp`))
        );
        await Promise.all(promises);

        req.datafile = {
            objectId,
            fileName
        };
        next();
    } catch (err) {
        console.log("handleImageCreateProducer err :", err);
        res.status(400).json({ error: err })
    }
};
