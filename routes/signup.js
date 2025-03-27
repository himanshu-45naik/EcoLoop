const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('signup', { title: 'Sign Up' });
});

router.post('/', (req, res) => {
    // In a real application, you would handle user registration here
    const { username, password } = req.body;
    console.log(`Signup data: Username - ${username}, Password - ${password}`);
    // Ideally, you would save the user to a database
    res.send('Signup successful!'); // Or redirect to a success page
});

module.exports = router;