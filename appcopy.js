require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000
const path = require('path');
const bodyParser = require('body-parser');
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

app.use(express.static(path.join(__dirname, 'public')));

  // Route to fetch a book by ID
  app.get('/book/:bookId', async (req, res) => {
    try {
      const bookId = req.params.bookId;
  
      // Connect to the database
      await sql.connect(config);
  
      // Query to fetch a book by ID
      const result = await sql.query(`SELECT * FROM book WHERE bookid = ${bookId}`);
  
      if (result.recordset.length > 0) {
        // Book found, send the book data as a JSON response
        res.json({ book: result.recordset[0] });
      } else {
        // Book not found
        res.status(404).send('Book not found');
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    } finally {
      // Close the database connection
      await sql.close();
    }
  });


  function getCurrentDay (){
    const cdate = new Date();

    let day = cdate.getDate();
    let month = cdate.getMonth() + 1;
    let year = cdate.getFullYear();

    // This arrangement can be altered based on how we want the date's format to appear.
    let currentDate = `${year}-${month}-${day}`;

    return currentDate
  }

  function getDeadline() {
    const ddate = new Date() 
    let dday = ddate.getDate();
    let dmonth = ddate.getMonth() + 1;
    let dyear = ddate.getFullYear();

    let dueDate=`${dyear}-${dmonth}-${dday}`;
    return dueDate

  }

  app.get('/burrow', async (req, res) => {
    try {

      const uid = 1 
      const bookId = 10
      // const uid = req.params.uid;
      // const bookId = req.params.bookId;
      
      // Connect to the database
      var pool = await sql.connect(config);
      // check if the person is authorised 
      const result = await pool.request().query(`
      SELECT personid from Person where personid = 1`)
      
      if (result.recordset.length > 0) {
            await pool.request().query(`
            SELECT quantity from BookSTock where bookid = ${bookId}`).then( result => {
              console.log(result);
              const qty = result.recordset[0].quantity
              
              if (qty > 0){
                  // creating the transaction
                    pool.request().query(`INSERT INTO Action (bookid,personid, borrowdate, duedate, returndate)
                    VALUES
                    (10,10, '2023-05-10', '2023-05-17','Null )`).then(
                      // decreasing the quantity of the book 
                        pool.request().query(`Update BookStock set quantity = quantity-1 where bookid = ${bookId}`).then(

                          // getting the transaction id 
                          pool.request().query("select TOP (1) transactionid,bookid from Action order by  transactionid desc").then(data => {
                            res.send(data.recordset)
                          }))
                        .catch(err => {
                          res.send("Error")
                          })
                    ).catch(err => {
                      "Error"
                    })
                } 
              else {
                res.send("Sorry! the book is not available Now! Check back again another day")
              }
            })

      } else {
        // Book not found
        res.status(404).send('Book not found');
      }
    }
     catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    } finally {
      // Close the database connection
    //   await pool.close();
    }
  });


  app.get('/return', async (req, res) => {
    try {
      const tId = 12
      const bookId = 10
      
      // const uid = req.params.uid;
      // const bookId = req.params.bookId;
      
      // Connect to the database
      var pool = await sql.connect(config);
      // check if the person is authorised 
      const result = await pool.request().query(`
      SELECT * from action where transactionId= ${tId} and bookid = ${bookId} and returndate = NULL`)
      
      if (result.recordset.length == 1) {
        await pool.request().query(
          `Update action set returndate = "2023-5-18" where bookid = ${bookId} and transactionid = ${tId}`).then( 
            pool.request().query(
            `Update BookStock set quantity = quantity+1 where bookid = ${bookId}`).then( 
              res.send("Book returned ")
            )
        )
            }
      else {
        // Transaction not found
        res.status(404).send('Transaction  not found! Make sure you entered the correct information');
      }
    }
     catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    } finally {
      // Close the database connection
    //   await pool.close();
    }
  });


  

 // Serve the HTML file when the root URL is requested
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

  // Start the server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
