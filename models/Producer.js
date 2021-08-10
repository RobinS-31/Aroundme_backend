// == Import : npm
const mongoose = require('mongoose');

const producerSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postcode: { type: String, required: true },
    phone: { type: String, default: '' },
    establishment: { type: String, required: true },
    job: { type: String, required: true },
    siret: { type: String, required: true },
    description: { type: String, default: '' },
    imageUrl: { type: Array, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    lon: { type: String, required: true },
    lat: { type: String, required: true },
    categories: { type: Array, required: true },
    isProducer: { type: Boolean, default: true },
    products: { type: Array, default: [] },
    createdAt: { type: Date },
    updatedAt: { type: Date }
});

module.exports = mongoose.model('Producer', producerSchema);
