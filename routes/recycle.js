const express = require('express');
const router = express.Router();

// Recycle route
router.get('/', (req, res) => {
    res.render('recycle', { title: 'Recycle' }); // Render the recycle view
});

module.exports = router;