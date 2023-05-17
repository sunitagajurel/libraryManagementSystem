
require('dotenv').config()
const sql = require('mssql');


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


console.log("Starting...");
connectAndQuery();

async function connectAndQuery() {
    try {
        var poolConnection = await sql.connect(config);

        console.log("Reading rows from the Table...");
        var resultSet = await poolConnection.request().query(`show tables`);

        
        poolConnection.close();
    } catch (err) {
        console.error(err.message);
    }
}