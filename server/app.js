const express = require('express');
require('dotenv').config();
const session = require('express-session');
const passport = require('./strategies/passport.js');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT;

// middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// TODO: SET SESSION STORE
// TODO: ADD LOGGER
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 5  // TODO: set to a shorter time
    }
    //store: MongoStore.create({ mongoUrl: "mongodb://localhost/your-db" }),
    // name: SET THE NAME FOR DIFFRENT APPS 
}));
app.use(passport.initialize());
app.use(passport.session());

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
    req.logOut((err) => {
        if (err) return next(err);

        res.redirect('/');
    })
});


// process.on('uncaughtException')

app.listen(PORT, () => console.log('Server running on port:',PORT));