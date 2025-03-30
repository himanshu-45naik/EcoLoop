const express = require('express');
const router = express.Router();

// Route to render the eco resources page
router.get('/', (req, res) => {
    res.render('eco_resources');
});

module.exports = router;