const express = require('express');
require('dotenv').config();
const session = require('express-session');
const passport = require('./strategies/passport.js');
const cookieParser = require('cookie-parser');
const logger = require('../logger/index.js');
const pgSession = require('connect-pg-simple')(session);

const app = express();
const PORT = process.env.PORT;

// middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const sess = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 *5
    },
    store: new pgSession({
        conObject:{
            host: process.env.PGHOST,
            port: process.env.PGPORT,
            database: process.env.PGDATABASE,
            user: process.env.PGUSER,
            password: process.env.PGPASSWORD,
        },
        tableName: 'session'
    })
};
app.use(passport.initialize());
app.use(passport.session());


if (process.env.NODE_ENV === 'production') {
    sess.cookie.secure = true;
}

// index page
app.use('/home', require('./router/profile.js'));

// signup route
app.use('/signup', require('./router/signup.js'));

// login route
app.use('/login',require('./router/login.js'));

// route for movies
app.use('/movies', require('./router/movie.js'));

// logout route
app.post('/logout', (req,res) => {
    const args = {
        id: req.user[0].id,
        agent: req.headers['user-agent'],
        ip: req.ip,
        method: req.method,
        role: req.user[0].user_role
    };

    console.log(args.role)

    req.logOut((err) => {
        if (err) return next(err);

        logger.info(`User ${args.id} logged out successfully!`, {
            ip: args.ip,
            method: args.method,
            agent: args.agent, 
            role: args.role
        });
        res.redirect('/');
    })
});


// process.on('uncaughtException')

app.listen(PORT, () => {
    console.log('Server running on port:',PORT);
    // TODO: logger.info(`Server up and running on port ${PORT}`);
});


