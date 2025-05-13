const express = require('express');
const {requireAuth} = require('../controller/authController.js');
const authRoles = require('../middleware/authRoles.js');
const {getAllMovies,getMovieById,reserveMovie,confirmReservation} = require('../controller/movieController.js');

const router = express.Router();

router.use(requireAuth);

router.get('/', authRoles('user','admin'), getAllMovies);

router.get('/:id', authRoles('user', 'admin'), getMovieById);

// FIXME: router.post('/movies/movie?id=movie_id/reserve .....')
// const body = req.query.id
// router.post('/movies/id=:movie_id/reserve', authRoles('user', 'admin'), reserveMovie);
router.post('/reserve', authRoles('user', 'admin'), reserveMovie);
// router.post('/reserve', reserveMovie);

router.post('reserve/confirmation', authRoles('user','admin'), confirmReservation);


module.exports = router;