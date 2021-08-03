// == Import : npm
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postcode: { type: String, required: true },
    phone: { type: String, default: '' },
    email: { type: String, required: true },
    password: { type: String, required: true },
})
module.exports = mongoose.model('User', userSchema);
