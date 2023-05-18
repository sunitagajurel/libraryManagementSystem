const express = require('express')
const app = express()
const port = 3001
const path = require('path');
const bodyParser = require('body-parser');
const sql = require('mssql');
require('dotenv').config()
const mysql = 


// const config = {
//     user: process.env.DB_USER,
//     password:process.env.PASSWORD,
//     server:process.env.SERVER,
//     port:1433,
//     database: process.env.DATABASE, 
//     authentication: {
//         type: 'default'
//     },
//     options: {
//         encrypt: true
//     }
// }

const conn = await mysql.createConnection({
    "host" : "localhost",
    "port": 3306,
    "user": "root",
    "password": "root",
    "database": "test"
});

async function connect(query){
    try {
        const conn = await sql.connect

        const result = await conn.request().query(query)

        conn.close()

        return result 

    }
    catch(err){
        console.error(err)
    }

}

app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+'/index.html'))
})


app.post('/search', (req, res) => {
    query = `select * from Products`
    const result = connect(query)
    res.send(result)
})

app.listen(port, () => {
  console.log(`app is listening on port ${port}`)
})