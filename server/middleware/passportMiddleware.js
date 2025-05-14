const passportLocal = require('../strategies/passport.js');

const passportLocalMiddleware = (req,res,next) => {
    passportLocal.authenticate('local', {
        successMessage: true,
        successRedirect: '/home',
        failureMessage:true, 
        failuerRedirect: '/login' 
    },(err,user,info) => {
        if (err) return next(err);
        
        if(!user) return res.status(401).json(info || {'message': 'login failed'});

        req.logIn(user, (err) => {
            if (err) return next(err); // let express handle it, return next(new Error("<>"));

            return res.redirect(200,'/home');
          });
    })(req,res,next);
};

module.exports = passportLocalMiddleware;