const DB = require('../config/db.js');
const bcrypt = require('bcrypt');
const logger = require('../../logger/index.js');


const handleSignup = async (req,res) => {
    const {username,email,password,confirmPassword} = req.body;
    const user = req.user?.[0] || {id:'anonymous', user_role:'guest'};

    if (!username || !password || !confirmPassword) {
        logger.warn(`user ${user.id}, Failed signup`, {
            reason: 'Unfilled fields'
        });

        res.status(400).json({'message': 'Input username and password'});
    }
    

    logger.info(`user ${user.id} accessed /signup`, {
        ip: req.ip,
        method: req.method,
        agent: req.headers['user-agent'],
        role: user.user_role
    });

    if(password !== confirmPassword){
        logger.warn(`user ${user.id} failed login attempt`, {
            ip: req.ip,
            method: req.method,
            agent: req.headers['user-agent'],
            role: user.user_role,
            reason: 'unmatched passwords'
        });

        return res.status(400).json({'message':'Passwords do not match'});
    } 

    if(!username || !password){
        logger.warn(`user ${user.id} failed login attempt`, {
            ip: req.ip,
            method: req.method,
            agent: req.headers['user-agent'],
            role: user.user_role,
            reason: 'username or password not submitted'
        });

        return res.status(400).json({'message': 'Username and Password required'});
    } 

    try {
        const registered = await DB.any('SELECT id FROM movie_users WHERE email=$1',[email]);

        if(registered.length > 0) {
            logger.warn(`user ${user.id} failed login attempt`, {
                ip: req.ip,
                method: req.method,
                agent: req.headers['user-agent'],
                role: user.user_role,
                reason: 'user already registered'
            });

            return res.status(400).json({'message': 'User already registered'});
        } 

        const hash = await bcrypt.hash(password, 10);

        await DB.none('INSERT INTO movie_users (username, email, user_password) VALUES ($1,$2,$3)',
            [username,email,hash]
        );

        logger.info(`user ${username} registered successfully!`, {
            ip: req.ip,
            method: req.method,
            agent: req.headers['user-agent'],
            role: user.user_role
        });

        res.status(200).json({'message': `${email} ,registered succesfully!`});
    } catch (err) {
        logger.error(`Signup session error for user ${user.id}`, {
            error: err.message,
            stack: err.stack,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
        });

        res.status(500).json({'message': 'Server error'});
    }
};

const requireAuth = (req, res, next) => {
    if (!req.isAuthenticated()) {

      return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
};
  

module.exports = {handleSignup,requireAuth};
