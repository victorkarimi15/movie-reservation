const {Strategy} = require('passport-google-oauth20');
const DB = require('../config/db.js');
const logger = require('../../logger/index.js');

function oauthStrategy(passport) {
    passport.use(new Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/login/google-auth/callback',
        }, 
        async (accessToken,refreshToken,profile,done) => {
            logger.info('user Login attempt in login/google-auth/callback');
            let user = await DB.oneOrNone(`
                SELECT id,username,email,user_role 
                FROM movie_users 
                WHERE google_id = $1`, 
                [profile.id]
            );

            if (user === null) {
                if (!profile.emails || !profile.emails[0].verified){
                    logger.warn(`user ${profile.displayName}, Login failed!`, {
                        reason: 'Email not verified'
                    });

                    return next(new Error('Email not verified!!'));
                } 

                user = await DB.none(`
                    INSERT INTO movie_users (username,email,google_id) 
                    VALUES ($1,$2,$3)`,
                    [profile.displayName,profile._json.email,profile.id]
                );
            }

            logger.info(`user ${user.username}, Logged in succesfully!`);
            return done(null,user);
        }
    ));

    passport.serializeUser((user,done) => {
        done(null,user.id);  
    });

    passport.deserializeUser(async (id,done) => {
        try {
            const user = await DB.any(`
                SELECT id,username,email,user_role 
                FROM movie_users 
                WHERE id = $1`,
                [id]
            ); 

            if(!user){
                logger.warn(`user cannot be deserialized`, {
                    reason: `${id} cannot be found!`
                });

                return done(null,false);
            } 

            done(null,user); 
        } catch (err) {
            logger.error('Error in deserializeuser session',{
                err: err.message,
                stack: err.stack.split('\n').slice(0, 4).join(' '),
                context: 'deserialize user function'
            });
            
            done(err,{'message': 'Server error'});
        }
    });
};

module.exports = oauthStrategy;