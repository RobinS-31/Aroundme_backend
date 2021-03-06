// == Import : npm
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uid = require('uid-safe');

// == Import : local
const User = require('../models/User');
const Producer = require('../models/Producer');
const upload = require('../config/multer');

exports.login = async (req, res, next) => {
    try {
        const userData = req.body;
        const findUserByEmail = await Promise.all([
            User.find({ email: userData.email }),
            Producer.find({ email: userData.email })
        ]);

        const userFilter = findUserByEmail.filter(value => {
            return value.length !== 0
        }).flat()[0];
        if (userFilter === undefined) return res.status(404).json({ error: 'Adresse email introuvable' }).end();

        const checkPassword = await bcrypt.compare(userData.password, userFilter.password);
        if (!checkPassword) return res.status(401).json({ error: 'Adresse email ou mot de passe incorrect' }).end();

        const xsrfToken = uid.sync(18);
        const userInfo = { ...userFilter._doc };
        delete userInfo.password;
        delete userInfo.__v;

        const token = jwt.sign(
            {
                userId: userInfo._id,
                xsrfToken
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '48h' }
        );

        res.cookie('access_token', token, {
            maxAge: 172800000,
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });
        res.status(200).json({
            xsrfToken,
            userInfo
        });
        res.send();

    } catch (err) {
        console.log("login err :", err);
        res.status(400).json({ error: err }).end();
    }
};

exports.logout = (req, res, next) => {
    res.clearCookie('access_token', {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });
    res.status(200);
    res.send();
};

exports.createUser = async (req, res, next) => {
    try {
        const userData = req.body;

        const passwordHash = await bcrypt.hash(userData.password, 10);
        if (!passwordHash) return res.status(200).json({ message: "Probl??me dans l'enregistrement du mot de passe" }).end();

        const user = new User({
            ...userData,
            password: passwordHash,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await user.save();
        res.status(201).json({ message: 'Votre compte ?? ??t?? cr????, vous pouvez maintenant vous connecter.'});
    } catch (err) {
        console.log("createUser err :", err);
        res.status(400).json({ error: err }).end();
    }
};

exports.createProducer = async (req, res, next) => {
    try {
        const producerData = JSON.parse(req.body.dataProducer);
        const dataFile = req.datafile;

        const passwordHash = await bcrypt.hash(producerData.password, 10);
        if (!passwordHash) return res.status(200).json({ message: "Probl??me dans l'enregistrement du mot de passe" }).end();

        const producer = new Producer({
            ...producerData,
            _id: dataFile.objectId,
            imageUrl: [
                `images/producers/${dataFile.objectId}/${dataFile.fileName}_h600.webp`,
                `images/producers/${dataFile.objectId}/${dataFile.fileName}_h140.webp`,
            ],
            password: passwordHash,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await producer.save();
        res.status(201).json({ message: 'Votre compte ?? ??t?? cr????, vous pouvez maintenant vous connecter.'});
    } catch (err) {
        console.log("createUser err :", err);
        res.status(400).json({ error: err }).end();
    }
};

exports.checkediflogged = async (req, res, next) => {
    try {
        if (req.cookies.access_token) {
            const token = req.cookies.access_token;
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

            const { userId, xsrfToken } = decodedToken;

            const findUserData = await Promise.all([
                User.find({ _id: userId }),
                Producer.find({ _id: userId })
            ]);

            const userFilter = findUserData.filter(value => {
                return value.length !== 0
            }).flat()[0];

            if (typeof userFilter === 'undefined') {
                res.clearCookie('access_token');
                res.status(202).send();
            }

            const userInfo = { ...userFilter._doc };
            delete userInfo.password;
            delete userInfo.__v;

            res.status(200).json({
                xsrfToken,
                userInfo
            });
        } else {
            res.status(202).send();
        }
    } catch (err) {
        console.log("checkediflogged err :", err);
        res.clearCookie("access_token");
        res.status(400).json({ error: err }).end();
    }
};

exports.checkEmailExist = async (req, res, next) => {
    const checkEmail = async (data, res, next) => {
        const checkEmailExist = await Promise.all([
            User.find({ email: data.email }),
            Producer.find({ email: data.email })
        ]);
        if (checkEmailExist[0].length !== 0 || checkEmailExist[1].length !== 0) {
            return res.status(200).json({message: "Cette adresse email existe d??j??"}).end();
        } else {
            next();
        }
    };

    try {
        if (req.url === '/createProducer') {
            upload(req, res, err => {
                const data = JSON.parse(req.body.dataProducer);
                checkEmail(data, res, next);
            })
        } else {
            const data = req.body;
            checkEmail(data, res, next);
        }
    } catch (err) {
        console.log("checkEmailExist err :", err);
        res.status(400).json({ error: err }).end();
    }
};

exports.checkAuthorisation = async (req, res, next) => {
    try {
        if (req.cookies.access_token) {
            const token = req.cookies.access_token;
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const { userId, xsrfToken } = decodedToken;

            if (req.url === '/updateproducer') {
                upload(req, res, err => {
                    const data = JSON.parse(req.body.producerData);

                    if (data.xsrfToken === xsrfToken && data.userId === userId) {
                        next();
                    } else {
                        res.status(401).send();
                    }
                })
            } else {
                const data = req.body;

                if (data.xsrfToken === xsrfToken && data.userId === userId) {
                    next();
                } else {
                    res.status(401).send();
                }
            }
        } else {
            res.status(401).send();
        }
    } catch (err) {
        console.log("checkAuthorisation err :", err);
        res.clearCookie("access_token");
        res.status(401).send();
    }
};
