const express = require('express');
const {handleSignup} =require('../controller/authController.js')

const router = express.Router();

router.post('/', handleSignup);

module.exports = router;
