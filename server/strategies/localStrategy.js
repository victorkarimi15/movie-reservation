const passport = require('passport')
const {Strategy} = require('passport-local');
const {userDB} = require('../config/db.js');
const bcrypt = require('bcrypt');

passport.use(new Strategy({
    // TODO: usernameField: 'email'    
}, async (username,password,done) =>{

    try {
        const user = await userDB.one('SELECT * FROM movie_users WHERE username = $1', [username]);

        if(!user) return done(null,false,{'message': 'Incorrect username or password.'});

        const isMatch = await bcrypt.compare(password,user.user_password);

        if(!isMatch) return done(null,false,{'message': 'Incorrect username or password.'});

        return done(false,user,{'message': 'User logged in!'});
    } catch (err) {
        console.error('Error at passport local strategy',err);
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
        const user = await userDB.any('SELECT id, username, email, user_role FROM movie_users WHERE id = $1',[id]);

        if(!user) return done(null,false);

        done(null, user);
    } catch(err) {
        done(err,{'message': 'Server error'});
    }
});

module.exports = passport;