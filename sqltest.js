
require('dotenv').config()
const sql = require('mssql');


const config = {
    user: process.env.DB_USER,
    password:process.env.PASSWORD,
    server:process.env.SERVER,
    port:process.env.PORT ,
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
        var resultSet = await poolConnection.request().query(`CREATE TABLE dbo.Products
                (ProductID int PRIMARY KEY NOT NULL,
                ProductName varchar(25) NOT NULL,
                Price money NULL,
                ProductDescription varchar(max) NULL)`);

        
        poolConnection.close();
    } catch (err) {
        console.error(err.message);
    }
}