const express = require('express');
const router = express.Router();
const logger = require('../../logger/index.js');
const authRoles = require('../middleware/auth-roles.js');



const userProfile = (req,res,next) => {
    const user = req.user[0];
    logger.info(`user ${user.id} accessed /home`,{
            ip: req.ip,
            method: req.method,
            agent: req.headers['user-agent'],
            role: user.user_role
        }
    );

    res.send(req.headers);
};

// home dir
router.get('/', (req,res,next) => {
    res.send("<a href='/login/google-auth'>Login with Google</a> \n <a href='/login/'>Login Locally</a>");

    const user = req.user?.[0]||{id: 'anonymous', user_role: 'guest'};
    logger.info(`user ${user.id} accessed /home`,{
            ip: req.ip,
            method: req.method,
            agent: req.headers['user-agent'],
            role: user.user_role
        }
    );
});

router.get('/dashboard', authRoles('user','admin'), userProfile);

module.exports = router;



