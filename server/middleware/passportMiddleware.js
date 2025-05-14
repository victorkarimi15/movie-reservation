const passportLocal = require('../strategies/passport.js');
const logger = require('../../logger/index.js');

const passportLocalMiddleware = (req,res,next) => {
    passportLocal.authenticate('local', {
        successMessage: true,
        successRedirect: '/home',
        failureMessage:true, 
        failureRedirect: '/login' 
    },(err,user,info) => {
        if (err){
            logger.error('Authentication error in /login', {
                error: err.message,
                stack: err.stack.split('\n').slice(0, 4).join(' '),
                ip: req.ip,
                agent: req.headers['user-agent']
            });
            
            return res.status(500).json({'message': 'Authentication error!'});
        } 
        
        if(!user){
            logger.warn('Failed login attempt',{
                ip: req.ip,
                method: req.method,
                agent: req.headers['user-agent'],
                reason: `User ${user.username} is not registered!`
            });
            return res.status(401).json(info || {'message': 'login failed'});
        } 

        req.logIn(user, (err) => {
            if (err){
                logger.error('Authentication error in /login', {
                    error: err.message,
                    stack: err.stack.split('\n').slice(0, 4).join(' '),
                    ip: req.ip,
                    agent: req.headers['user-agent']
                });

                return res.status(500).json({
                    'message': 'Authentication error!'
                });
            }

            logger.info(`user ${user.username} logged in successfullly!`,{
                ip: req.ip,
                method: req.method,
                agent: req.headers['user-agent'],
                role: user.user_role
            });

            return res.redirect(200,'/home');
          });
    })(req,res,next);
};

module.exports = passportLocalMiddleware;