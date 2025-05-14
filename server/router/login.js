const express = require('express');
const router = express.Router();
const passportLocalMiddleware = require('../middleware/passportMiddleware.js')
const passportOauth = require('../strategies/passport.js');

router.post('/', passportLocalMiddleware);

router.get('/google-auth', passportOauth.authenticate('google', {
    scope: ['profile', 'email'],
}));

router.get('/google-auth/callback', passportOauth.authenticate('google',{
    // successMessage: true,
    // failureMessage: true,
    failureRedirect: '/login',
    successRedirect: '/home/dashboard'
}));

module.exports = router;