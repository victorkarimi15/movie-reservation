const {movieDB} = require('../config/db.js');
const {userDB} = require('../config/db.js');
const stkPayment = require('../services/stkPush.js');


const getAllMovies = async (req,res) => {
    try {
        const movieList = await movieDB.manyOrNone('SELECT * FROM movies ORDER BY genre');

        res.status(200).send(movieList);
    } catch (err) {
        res.status(500).json({'message': 'Server error!'});   
    }
};

const getMovieById = async (req,res) => {
    try {
        if (req.params && req.params.id) {
            const movie = await movieDB.any('SELECT * FROM movies WHERE movie_id = $1', [req.params.id]);

            res.status(200).send(movie);
        }     
    } catch (err) {
        res.status(500).json({'message': 'Server error'});
    }
;}

const addMovie =  async(req,res) => {
    const {title,releaseDate,descripton,genre,thumbnail} = req.body;
    const file = req.file;

    try {
        const listedMovie = await movieDB.any('SELECT movie_id FROM movies WHERE title = $1', [title]);

        if(listedMovie.length > 0) {
            return res.status(400).json({'message': `Moive: ${title}, is already listed!`});
        }

        if(!file) { return res.statue(400).json({'message': 'Thumbnail file required'});}
        
        let query = `
            INSERT (title,release_date,description,genre,total_seats,thumbnail)
            INTO movies VALUES($1,$2,$3,$4,$5,$6)'
        `
        // TODO: SET NUMBER OF SEATS
        await movieDB.none(query,[title,releaseDate,descripton,genre,200,file.destination]);

        res.status(200).json({'message': 'Movie added Succesfully!'});

    } catch (err) {
        res.status(500).json({'message': 'Server error!'});
    }
};

const reserveMovie = async (req,res) => {
    const {movie_id} = req.body;

    try {
        const userData = {
            amount: 1,
            paymentNumber: 254726409038
        };

        const response = await stkPayment(userData);

        /* 
         TODO: handle the checking of number of seats prior
         confirm payment from the endpoint 
         if payment is successful five a nice response
         if not give an error
        */
        
    } catch (err) {
        console.log('Error reserving a movie', err);
        res.status(500).json({'message': 'Server error!'});
    }
   
};

const confirmReservation = (req,res) => {
    console.log('Callback confirmed');
    console.log(req.body);

    res.status(200).json({'message': 'You good buoyy!'});
};

module.exports = {getAllMovies,getMovieById,addMovie,reserveMovie,confirmReservation};



