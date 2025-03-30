const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Require it here, at the top of the file
const cityWasteManagementRanking = require('/home/himanshu/Coding/ecoloop/frontend/init/data.js');

const ecoResourcesRoutes = require('./routes/eco_resources');

// Setup view engine and layouts
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/layout');

// Remove layout from res.locals
app.use((req, res, next) => {
    res.locals = {
        ...res.locals,
        title: 'Ecoloop'
    };
    next();
});

app.set('layout extractScripts', true);
app.set('layout extractStyles', true);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({ 
    origin: ['http://localhost:5000', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api', createProxyMiddleware({
    target: 'http://localhost:5000',
    changeOrigin: true,
    pathRewrite: {
        '^/api': ''
    }
}));

app.get('/dashboard', (req, res) => {
    res.render('dashboard', { title: 'Dashboard' });
});

app.get('/recycling', (req, res) => {
    res.render('recycling');
});

app.get('/socialbuzz', (req, res) => {
    res.render('socialbuzz');
});

app.get('/', (req, res) => {
    console.log("cityWasteManagementRanking:", cityWasteManagementRanking); // Check the data
    res.render('home', { cityWasteManagementRanking: cityWasteManagementRanking });
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});