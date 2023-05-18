const sql = require('mssql');
require('dotenv').config()


const config = {
    user: process.env.DB_USER,
    password:process.env.PASSWORD,
    server:process.env.SERVER,
    port:1433,
    database: process.env.DATABASE, 
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true
    }
}

const connection =  sql.connect(config);

module.exports = connection;
