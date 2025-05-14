const DB = require('../config/db.js');
const stkPayment = require('../services/stkPush.js');
const logger = require('../../logger/index.js');
const { head } = require('../router/profile.js');


const getAllMovies = async (req,res) => {
    logger.info(`user ${req.user[0].id} accessed /movies`, {
        ip: req.ip,
        method: req.method,
        agent: req.headers['user-agent'],
        role: req.user[0].user_role
    });

    try {
        const movieList = await DB.manyOrNone(`
            SELECT * 
            FROM movies 
            ORDER BY genre`);

        res.status(200).send(movieList);
    } catch (err) {
        logger.error('Error in /movies', {
            error: err.message,
            stack: err.stack.split('\n').slice(0, 4).join(' '),
            ip: req.ip,
            agent: req.headers['user-agent']
        });
        res.status(500).json({'message': 'Server error!'});   
    }
};

const getMovieById = async (req,res) => {
    try {
        if (req.params && req.params.id) {
            logger.info(`user ${req.user[0].id} accessed /movies/${req.params.id}`, {
                ip: req.ip,
                method: req.method,
                agent: req.headers['user-agent'],
                role: req.user[0].user_role
            });
            const movie = await DB.any(`
                SELECT * 
                FROM movies 
                WHERE movie_id = $1`,
                [req.params.id]);

            res.status(200).send(movie);
        }     
    } catch (err) {
        logger.error(`Error in /movies/${req.params.id}`, {
            error: err.message,
            stack: err.stack.split('\n').slice(0, 4).join(' '),
            ip: req.ip,
            agent: req.headers['user-agent']
        });

        res.status(500).json({'message': 'Server error'});
    }
;}

const addMovie =  async(req,res) => {
    const {title,releaseDate,descripton,genre,thumbnail} = req.body;
    const file = req.file;

    logger.info(`user ${req.user[0].id}, accessed /movies/add-movie`,{
        ip: req.ip,
        method: req.method,
        agent: req.headers['user-agent'],
        role: req.user[0].user_role
    });

    if (!title || !releaseDate || !descripton || !genre || !thumbnail) {
        logger.warn(`user ${req.user[0].id}, Error adding movie`,{
            reason: 'Unprovided data'
        });
    }
    try {
        const listedMovie = await DB.any(`
            SELECT movie_id
            FROM movies 
            WHERE title = $1`,
            [title]
        );

        if(listedMovie.length > 0) {
            logger.warn(`user ${req.user[0].id}, Error adding movie`,{
                reason: `Movie ${title} already listed!`
            });

            return res.status(400).json({'message': `Moive: ${title}, is already listed!`});
        }

        if(!file) { 
            logger.warn(`user ${req.user[0].id}, Error adding thumbnail`,{
                reason: `Thumbnail not present!`
            });

            return res.statue(400).json({'message': 'Thumbnail file required'});
        }
        
        let query = `
            INSERT (title,release_date,description,genre,total_seats,thumbnail)
            INTO movies 
            VALUES($1,$2,$3,$4,$5,$6)
        `
        // TODO: SET NUMBER OF SEATS
        await DB.none(query,[title,releaseDate,descripton,genre,200,file.destination]);

        res.status(200).json({'message': 'Movie added Succesfully!'});

    } catch (err) {
        logger.error(`Error in /movies/add-movie`, {
            error: err.message,
            stack: err.stack.split('\n').slice(0, 4).join(' '),
            ip: req.ip,
            agent: req.headers['user-agent']
        });

        res.status(500).json({'message': 'Server error!'});
    }
};

const reserveMovie = async (req,res) => {
    const {movie_id} = req.body;

    logger.info(`user ${req.user[0].id}, accessed /movies/reserve`,{
        ip: req.ip,
        method: req.method,
        agent: req.headers['user-agent'],
        role: req.user[0].user_role
    });


    try {
        // TODO: INPUTS FROM THE USER
        const userData = {
            amount: 1,
            paymentNumber: 254726409038
        };

        logger.info(`user ${req.user[0].id}, initiated stk payment`,{
            ip: req.ip,
            method: req.method,
            agent: req.headers['user-agent'],
            role: req.user[0].user_role
        });
        const response = await stkPayment(userData);

        /* 
         TODO: handle the checking of number of seats prior
         confirm payment from the endpoint 
         if payment is successful five a nice response
         if not give an error
        */
        
    } catch (err) {
        logger.error(`Error in /movies/reserve`, {
            error: err.message,
            stack: err.stack.split('\n').slice(0, 4).join(' '),
            ip: req.ip,
            agent: req.headers['user-agent']
        });
        
        res.status(500).json({'message': 'Server error!'});
    }
   
};

const confirmReservation = (req,res) => {
    console.log('Callback confirmed');
    console.log(req.body);

    res.status(200).json({'message': 'You good buoyy!'});
};

module.exports = {getAllMovies,getMovieById,addMovie,reserveMovie,confirmReservation};



