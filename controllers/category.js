// == Import : local
const Category = require('../models/Category');

exports.getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find();
        if (!categories) return res.status(202).json({ message: "Aucune catégorie trouvé" }).end();

        res.status(200).json(categories);
    } catch (err) {
        console.log("getCategories err :", err);
        res.status(400).json({ error: err }).end();
    }
};
