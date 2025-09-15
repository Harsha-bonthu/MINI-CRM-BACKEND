const express = require('express');
const passport = require('passport');
const router = express.Router();

// 1️⃣ Start Google login
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// 2️⃣ Callback route after Google login
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login' }),
    (req, res) => {
        // Successful login → redirect to frontend
        res.redirect('http://localhost:5173'); 
    }
);

// 3️⃣ Get current logged-in user
router.get('/current_user', (req, res) => {
    res.send(req.user);
});

// 4️⃣ Logout
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('http://localhost:5173');
    });
});

module.exports = router;
