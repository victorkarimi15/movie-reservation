const express = require('express');
require('dotenv').config();
const session = require('express-session');
const passport = require('./strategies/localStrategy.js');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT;

// middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// SET SESSION STORE???????????????????? AND ADD LOGGER
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 5 // set to a shorter time
    }
    //store: MongoStore.create({ mongoUrl: "mongodb://localhost/your-db" }),
    // name: SET THE NAME FOR DIFFRENT APPS 
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req,res,next) => {
    res.send("<a href='/login/google-auth'>Login with Google</a> \n <a href='/login/'>Login Locally</a>");
})

app.get('/home', (req,res,next) => {
    console.log('hey there!');
    res.status(200).json({'message': `user: ${JSON.stringify(req.user,null,2)}`});

    next();
})

// signup route
app.use('/signup', require('./router/signup.js'));

// login route
app.use('/login',require('./router/login.js'));

// route for movies
app.use('/movies', require('./router/movie.js'));


// process.on('uncaughtException')

app.listen(PORT, () => console.log('Server running on port:',PORT));