// == Import : npm
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require("helmet");
require('dotenv').config();

// == Import : local
const authRoutes = require('./routes/auth');
const producersRoutes = require('./routes/producers');
const categoriesRoutes = require('./routes/category');
const productsRoutes = require('./routes/product');
const dashboardRoutes = require('./routes/dashboard');

mongoose.connect(process.env.MONGO_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();
app.use(helmet());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONT_APP_URL);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
app.use(express.json());
app.use(cookieParser());
app.use('/images', express.static('images'));
app.use('/api/auth', authRoutes);
app.use('/api/producers', producersRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/dashboard', dashboardRoutes);

module.exports = app;
