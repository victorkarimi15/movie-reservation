const express = require('express');
const {handleSignup} =require('../controller/auth-controller.js')

const router = express.Router();

router.post('/', handleSignup);

module.exports = router;
