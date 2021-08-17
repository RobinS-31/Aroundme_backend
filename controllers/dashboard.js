// == Import : npm
const bcrypt = require('bcrypt');

// == Import : local
const User = require('../models/User');
const Producer = require('../models/Producer');

exports.updateUser = async (req, res, next) => {
    try {
        const userData = { ...req.body };
        const { userId } = userData;
        delete userData.xsrfToken;
        delete userData.userId;

        const updateUser = await User.findByIdAndUpdate(
            userId,
            {
                ...userData,
                updatedAt: new Date()
            },
            {
                new: true,
                runValidators: true
            }
        );
        if (!updateUser) return res.status(404).json({ error: 'no match ID' });

        const userInfo = { ...updateUser._doc }
        delete userInfo.password;
        delete userInfo.__v;

        res.status(200).json(userInfo);
    } catch (err) {
        console.log("updateProducer err :", err);
        res.status(400).json({ error: err }).end();
    }
}

exports.updateProducer = async (req, res, next) => {
    try {
        const producerData = JSON.parse(req.body.producerData);
        const { userId } = producerData;
        delete producerData.xsrfToken;
        delete producerData.userId;

        if (req.files.length !== 0) {
            const dataFile = req.datafile;
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
        if (!updateProducer) return res.status(404).json({ error: 'no match ID' });

        const producerInfo = { ...updateProducer._doc }
        delete producerInfo.password;
        delete producerInfo.__v;

        res.status(200).json(producerInfo);
    } catch (err) {
        console.log("updateProducer err :", err);
        res.status(400).json({ error: err }).end();
    }
};

exports.updatePasswordAccount = async (req, res, next) => {
    try {
        const securityData = { ...req.body };
        const { userId, isProducer } = securityData;
        delete securityData.xsrfToken;
        delete securityData.userId;
        delete securityData.isProducer;

        let dataAccount;
        if (isProducer) {
            dataAccount = await Producer.findById(userId);
        } else {
            dataAccount = await User.findById(userId);
        }

        const checkPassword = await bcrypt.compare(securityData.oldPassword, dataAccount.password);
        if (!checkPassword) return res.status(400).json({ error: 'Adresse email ou mot de passe incorrect' }).end();

        const passwordHash = await bcrypt.hash(securityData.password, 10);
        if (!passwordHash) return res.status(400).json({ message: "Problème dans l'enregistrement du mot de passe" }).end();

        let updatePassword;
        if (isProducer) {
            updatePassword = await Producer.findByIdAndUpdate(
                userId,
                {
                    password: passwordHash,
                    updatedAt: new Date()
                },
                {
                    new: true,
                    runValidators: true
                }
            )
        } else {
            updatePassword = await User.findByIdAndUpdate(
                userId,
                {
                    password: passwordHash,
                    updatedAt: new Date()
                },
                {
                    new: true,
                    runValidators: true
                }
            )
        }
        if (!updatePassword) return res.status(404).json({ error: 'no match ID' });

        res.status(200).send();
    } catch (err) {
        console.log("updatePasswordAccount err :", err);
        res.status(400).json({ error: err }).end();
    }
};

exports.updateProducerProducts = async (req, res, next) => {
    try {
        const userId = req.body.userId;
        const productsData = req.body.producerProducts;
        const updateProducts = await Producer.findByIdAndUpdate(
            userId,
            {
                products: productsData,
                updatedAt: new Date()
            },
            {
                new: true,
                runValidators: true
            }
        );
        if (!updateProducts) return res.status(404).json({ error: 'no match ID' });

        res.status(200).json(updateProducts);

    } catch (err) {
        console.log("updateProducerProducts err :", err);
        res.status(400).json({ error: err }).end();
    }
};
