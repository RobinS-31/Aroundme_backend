// == Import : local
const Producer = require('../models/Producer');
const Product = require('../models/Product');

exports.getProducers = async (req, res, next) => {
    try {
        const producers = await Producer.find();
        if (!producers) return res.status(202).json({ message: "Aucun producteur trouvé" }).end();

        res.status(200).json(producers);
    } catch (err) {
        console.log("getProducers err :", err);
        res.status(400).json({ error: err }).end();
    }
};

exports.getOneProducer = async (req, res, next) => {
    try {
        const producer = await Producer.findById(req.params.id);
        if (!producer) return res.status(202).json({ message: "Aucun producteur trouvé" }).end();

        const producerData = { ...producer._doc };
        delete producerData.password;
        delete producerData.__v;

        res.status(200).json(producerData);
    } catch (err) {
        console.log("getOneProducer err :", err);
        res.status(400).json({ error: err }).end();
    }
};
