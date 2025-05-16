const initOptions = {
    query(e) {
        console.log('\tExecuting query: ', e.query);
    },
    connect(e) {
        
        console.log('\tConnected to PostgreSQL:',e.client.connectionParameters.database);        
    },
    disconnect(e) {
        console.log('\tDisconnected from PostgreSQL');        
    }
};

const pgp = require('pg-promise')(initOptions);

// const cn = {
//     host: 'localhost',
//     port: 5432,
//     database: 'movie_reservation',
//     user: 'movie_recommender',
//     password: 'client1',
//     // max: 30 //maximum number of users!, "types" - in case you want to set custom type parsers on the pool level
// };

const cn = {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
};


// const db = pgp('postgres://john:pass123@localhost:5432/products');
const DB = pgp(cn);


module.exports = DB;





