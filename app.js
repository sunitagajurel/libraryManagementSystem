const express = require('express')
const app = express()
const port = 3001
const path = require('path');
const bodyParser = require('body-parser');
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


async function connect(query){
    try {
        const conn = await sql.connect(config)

        const result = await conn.request().query(query)

        conn.close()

        return result 

    }
    catch(err){
        console.error(err)
    }

}

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+'/index.html'))
})


app.post('/search', (req, res) => {
    query = ``
    query = `select * from Book_description`
    // connect(query).then((result)=> {
    //     result = [{"bookid":1,"bookdesc":"The Hobbit","edition":"First Edition","language":"English                                           ","year":1937,"isbn":"9780007497904","rating":4.2,"genre":"Fantasy"},{"bookid":2,"bookdesc":"Harry Potter and the Philosopher's Stone","edition":"First Edition","language":"English                                           ","year":1997,"isbn":"9780747532699","rating":4.5,"genre":"Fantasy"},{"bookid":3,"bookdesc":"Alice in Wonderland","edition":"Revised Edition","language":"English                                           ","year":1865,"isbn":"9781503290283","rating":4.1,"genre":"Fantasy"},{"bookid":4,"bookdesc":"The Chronicles of Narnia","edition":"Complete Collection","language":"English                                           ","year":1950,"isbn":"9780064404990","rating":4.6,"genre":"Fantasy"},{"bookid":5,"bookdesc":"Pride and Prejudice","edition":"Revised Edition","language":"English                                           ","year":1813,"isbn":"9780141439518","rating":4.7,"genre":"Classic"},{"bookid":6,"bookdesc":"To Kill a Mockingbird","edition":"First Edition","language":"English                                           ","year":1960,"isbn":"9780062420701","rating":4.5,"genre":"Fiction"},{"bookid":7,"bookdesc":"The Great Gatsby","edition":"First Edition","language":"English                                           ","year":1925,"isbn":"9780743273565","rating":4.2,"genre":"Classic"},{"bookid":8,"bookdesc":"1984","edition":"Revised Edition","language":"English                                           ","year":1949,"isbn":"9780451524935","rating":4.3,"genre":"Dystopian"},{"bookid":9,"bookdesc":"The Catcher in the Rye","edition":"First Edition","language":"English                                           ","year":1951,"isbn":"9780316769488","rating":4,"genre":"Fiction"},{"bookid":10,"bookdesc":"Moby-Dick","edition":"Revised Edition","language":"English                                           ","year":1851,"isbn":"9781503280789","rating":4.4,"genre":"Adventure"}]
    //     res.send(result.recordset);
    // })
    result = [{"bookid":1,"bookdesc":"The Hobbit","edition":"First Edition","language":"English                                           ","year":1937,"isbn":"9780007497904","rating":4.2,"genre":"Fantasy"},{"bookid":2,"bookdesc":"Harry Potter and the Philosopher's Stone","edition":"First Edition","language":"English                                           ","year":1997,"isbn":"9780747532699","rating":4.5,"genre":"Fantasy"},{"bookid":3,"bookdesc":"Alice in Wonderland","edition":"Revised Edition","language":"English                                           ","year":1865,"isbn":"9781503290283","rating":4.1,"genre":"Fantasy"},{"bookid":4,"bookdesc":"The Chronicles of Narnia","edition":"Complete Collection","language":"English                                           ","year":1950,"isbn":"9780064404990","rating":4.6,"genre":"Fantasy"},{"bookid":5,"bookdesc":"Pride and Prejudice","edition":"Revised Edition","language":"English                                           ","year":1813,"isbn":"9780141439518","rating":4.7,"genre":"Classic"},{"bookid":6,"bookdesc":"To Kill a Mockingbird","edition":"First Edition","language":"English                                           ","year":1960,"isbn":"9780062420701","rating":4.5,"genre":"Fiction"},{"bookid":7,"bookdesc":"The Great Gatsby","edition":"First Edition","language":"English                                           ","year":1925,"isbn":"9780743273565","rating":4.2,"genre":"Classic"},{"bookid":8,"bookdesc":"1984","edition":"Revised Edition","language":"English                                           ","year":1949,"isbn":"9780451524935","rating":4.3,"genre":"Dystopian"},{"bookid":9,"bookdesc":"The Catcher in the Rye","edition":"First Edition","language":"English                                           ","year":1951,"isbn":"9780316769488","rating":4,"genre":"Fiction"},{"bookid":10,"bookdesc":"Moby-Dick","edition":"Revised Edition","language":"English                                           ","year":1851,"isbn":"9781503280789","rating":4.4,"genre":"Adventure"}]
    res.send(result);

    
})

app.listen(port, () => {
  console.log(`app is listening on port ${port}`)
})