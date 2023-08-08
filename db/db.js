const pgp = require('pg-promise')();
const dbConfig = {
    host: 'localhost',
    port: 5432,
    database: 'hotel',
    user: 'postgres',
    password: 'tsilavina'
};
const db = pgp(dbConfig);

module.exports = db;
