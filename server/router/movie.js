const express = require('express');
const {requireAuth} = require('../controller/auth-controller.js');
const authRoles = require('../middleware/auth-roles.js');
const {getAllMovies,getMovieById,reserveMovie,confirmReservation, addMovie} = require('../controller/movie-controller.js');
const {v4:uuid} = require('uuid');
const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        let filePath = path.join('../', '../', 'uploads', 'thumbnails');
        cb(null, filePath);
    },
    filename: function (req,file,cb) {
        let fileName = `${file.fieldname}-${uuid()}`;
        cb(null,fileName);
    }
});
const upload = multer({storage: storage});
const router = express.Router();

router.use(requireAuth);

router.get('/', authRoles('user','admin'), getAllMovies);

router.get('/:id', authRoles('user', 'admin'), getMovieById);

router.post('/add-movie', authRoles('admin'), upload.single('thumbnail'), addMovie)

// FIXME: router.post('/movies/movie?id=movie_id/reserve .....')
// const body = req.query.id
// router.post('/movies/id=:movie_id/reserve', authRoles('user', 'admin'), reserveMovie);
router.post('/reserve', authRoles('user', 'admin'), reserveMovie);
// router.post('/reserve', reserveMovie);

router.post('reserve/confirmation', authRoles('user','admin'), confirmReservation);


module.exports = router;
