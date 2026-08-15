const db = require('mysql2/promise');

const pool = db.createPool({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    dateStrings: true
});

module.exports = pool;