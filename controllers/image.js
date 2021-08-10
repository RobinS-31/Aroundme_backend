// == Import : npm
const mongoose = require('mongoose');
const sharp = require('sharp');
const fs = require('fs/promises');
const path = require('path');

// == Import : local
const upload = require('../config/multer');

exports.handleImageProducerAccount = async (req, res, next) => {
    try {
        const data = JSON.parse(req.body.producerData);

        if (!req.files || req.files.length === 0) {
            console.log("handleImageProducerAccount !req.files");
            next();

        } else {
            let objectId;
            if (req.method === "PUT" && data.userId) {
                objectId = data.userId;
                await Promise.all(
                    data.imageUrl.map(async image => {
                        await fs.unlink(path.join(process.cwd(), image));
                    })
                );
            } else {
                objectId = mongoose.Types.ObjectId();
                await fs.mkdir(path.join(process.cwd(), `images/producers/${objectId}`))
            }

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

            console.log("handleImageProducerAccount req.files");
            next();
        }
    } catch (err) {
        console.log("handleImageCreateProducer err :", err);
        res.status(400).json({ error: err })
    }
};
