// == Import : local
const Product = require('../models/Product');

exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        if (!products) return res.status(202).json({ message: "Aucun produit trouvé" }).end();

        res.status(200).json(products);
    } catch (err) {
        console.log("getProducts err :", err);
        res.status(400).json({ error: err }).end();
    }
};
