const passport = require('passport');
const {Strategy} = require('passport-google-oauth20');
const {userDB} = require('../config/db.js');

passport.use(new Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/login/google-auth/callback',
    }, 
    async (accessToken,refreshToken,profile,done) => {
        let user = await userDB.oneOrNone('SELECT id,username,email,user_role FROM movie_users WHERE google_id = $1', [profile.id]);

        if (user === null) {
            if (!profile.emails || !profile.emails[0].verified) return next(new Error('Email not verified!!'));

            console.log('saving new google user to db...');
            user = await userDB.none('INSERT INTO movie_users (username,email,google_id) VALUES ($1,$2,$3)', [profile.displayName,profile._json.email,profile.id]);
        }

        return done(null,user);
}));

passport.serializeUser((user,done) => {
    done(null,user.id);  
});

passport.deserializeUser(async (id,done) => {
    try {
        const user = await userDB.oneOrNone('SELECT id,username,email,user_role FROM movie_users WHERE id = $1',[id]); 

        if(user === null) return done(null,false);

        done(null,user); 
    } catch (err) {
        done(err,{'message': 'Server error'});
    }
});

module.exports = passport;