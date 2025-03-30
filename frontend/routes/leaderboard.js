const express = require('express');
const router = express.Router();
const cityWasteManagementRanking = require('../init/data');

// Route to render the leaderboard
router.get('/', (req, res) => {
    console.log(cityWasteManagementRanking); // Log the data to check its value
    res.render('leaderboard', { cityWasteManagementRanking });
});


module.exports = router;