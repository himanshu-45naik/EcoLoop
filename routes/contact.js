const express = require('express');
const router = express.Router();

// Contact route
router.get('/', (req, res) => {
    res.send('Contact Page');
});

module.exports = router;
