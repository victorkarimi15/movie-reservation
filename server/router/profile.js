const express = require('express');
const router = express.Router()

const userProfile = (req,res,next) => {
    // FIXME: get the req.user;
    res.send(req.headers);
};

// home dir
router.get('/', (req,res,next) => {
    res.send("<a href='/login/google-auth'>Login with Google</a> \n <a href='/login/'>Login Locally</a>")
});

router.get('/dashboard',userProfile);

module.exports = router;



