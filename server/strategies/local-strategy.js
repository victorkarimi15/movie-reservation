const {Strategy} = require('passport-local');
const DB = require('../config/db.js');
const bcrypt = require('bcrypt');
const logger = require('../../logger/index.js');

function localStrategy(passport) {
    passport.use(new Strategy({
        usernameField: 'email'    
        }, async (username,password,done) =>{

        try {
            const user = await DB.one(`
                SELECT * FROM movie_users 
                WHERE email = $1`,
                [username]
            );

            if(!user) {
                logger.warn(`user ${username}, Login failed!`, {
                    reason: 'unregistered username'
                });

                return done(null,false,{'message': 'Incorrect username.'});
            }
            const isMatch = await bcrypt.compare(password,user.user_password);

            if(!isMatch) {
                logger.warn(`user ${username}, Login failed`, {
                    reason: 'Incorrect password'
                });

                return done(null,false,{'message': 'Incorrect username or password.'});
            }
            return done(false,user,{'message': 'User logged in!'});
        } catch (err) {
            logger.error('Error in Login session',{
                err: err.message,
                stack: err.stack.split('\n').slice(0, 4).join(' '),
                context: 'Passport local strategy'
            });
            
            return done(err,{'message': 'Server error!'});
        }
    }));

    // sent to user similar to jwt cookie
    passport.serializeUser((user,done) => {
        done(null,user.id);
    });

    // similar to verification of jwt
    passport.deserializeUser(async (id,done) => {
        try {
            const user = await DB.any(`
                SELECT id, username, email, user_role 
                FROM movie_users 
                WHERE id = $1`,
                [id]
            );

            if(!user) {
                logger.warn(`user cannot be deserialized`, {
                    reason: `${id} not found!`
                });

                return done(null,false);
            }
            done(null, user);
        } catch(err) {
            logger.error('Error in deserializeuser session',{
                err: err.message,
                stack: err.stack.split('\n').slice(0, 4).join(' '),
                context: 'deserialize user function'
            });
            
            done(err,{'message': 'Server error'});
        }
    });
};

module.exports = localStrategy;