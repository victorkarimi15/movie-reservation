const {userDB} = require('../config/db.js');
const {v4:uuid} = require('uuid');
const bcrypt = require('bcrypt');


const handleSignup = async (req,res) => {
    const {username,password,confirmPassword} = req.body;

    if(password !== confirmPassword) return res.status(400).json({'message':'Passwords do not match'});

    if(!username || !password) return res.status(400).json({'message': 'Username and Password required'});

    try {
        // check if username is already registered
        const registered = await userDB.any('SELECT id FROM movie_users WHERE username=$1',[username]);

        if(registered.length > 0) return res.status(400).json({'message': 'User already registered'});

        const email = 'john@example.com';
        const hash = await bcrypt.hash(password, 10);

        await userDB.none('INSERT INTO movie_users (username, email, user_password) VALUES ($1,$2,$3)',
            [username,email,hash]
        );

        res.status(200).json({'message': `${email} ,registered succesfully!`});
    } catch (err) {
        console.error('Error at handlesignup', err);
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
