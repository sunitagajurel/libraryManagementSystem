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
app.use(bodyParser.urlencoded({extended: false}));

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

  function getDueDate() {
    const ddate = new Date() 
    let dday = ddate.getDate();
    let dmonth = ddate.getMonth() + 1;
    let dyear = ddate.getFullYear();

    let dueDate=`${dyear}-${dmonth}-${dday}`;
    return dueDate

  }

  // app.get('/burrow', async (req, res) => {
  //   try {

  //     // const uid = 1 
  //     // const bookId = 10
  //     const uId = req.query.uId;
  //     const bookId = req.query.bookId;

  //     console.log(uId,bookId)
      
  //     // Connect to the database
  //     var pool = await sql.connect(config);
  //     // check if the person is authorised 
  //     const result = await pool.request().query(`
  //     SELECT personid from Person where personid = ${uId}`)
      
  //     if (result.recordset.length > 0) {
  //           await pool.request().query(`
  //           SELECT quantity from BookSTock where bookid = ${bookId}`).then( result => {
  //             console.log(result);
  //             const qty = result.recordset[0].quantity
              
  //             if (qty > 0){
  //                 // creating the transaction
  //                   pool.request().query(`INSERT INTO Action (bookid,personid, borrowdate, duedate, returndate)
  //                   VALUES
  //                   (10,10, '2023-05-10', '2023-05-17','Null )`).then(
  //                     // decreasing the quantity of the book 
  //                       pool.request().query(`Update BookStock set quantity = quantity-1 where bookid = ${bookId}`).then(

  //                         // getting the transaction id 
  //                         pool.request().query("select TOP (1) transactionid,bookid from Action order by  transactionid desc").then(data => {
  //                           res.send(data.recordset)
  //                         }))
  //                       .catch(err => {
  //                         res.send("Something went wrong while getting the transactiopn details")
  //                         })
  //                   ).catch(err => {
  //                     res.send("something went wrong while updating the stocks")
  //                   }).
  //                   catch(err => {
  //                     res.send("Cannot Complete the transaction, maybe wrong transaction id or bookid")
  //                   })
  //               } 
  //             else {
  //               res.send("Sorry! the book is not available Now! Check back again another day")
  //             }
  //           })

  //     } else {
  //       // Book not found
  //       res.status(404).send('Book not found');
  //     }
  //   }
  //    catch (error) {
  //     console.error('Error:', error);
  //     // res.status(500).send('Internal Server Error');
  //   } finally {
  //     // Close the database connection
  //     // await pool.close();
  //   }
  // });


  app.get('/burrow', async (req, res) => {
    try {
      const uId = req.query.uId;
      const bookId = req.query.bookId;
  
      var pool = await sql.connect(config);
      
  
      const result = await pool.request().query(`
        SELECT personid FROM Person WHERE personid = ${uId}
      `);
  
      if (result.recordset.length > 0) {
          const currentDate = getCurrentDay();
          const dueDate = getDueDate();
          const transaction = new sql.Transaction(pool);

          // creating the transaction so that the changes are only reflected after it is commited"
         
          await transaction.begin()
          try {
              // creating the transaction 
              await transaction.request().input('borrowdate', sql.Date,currentDate)
              .input('duedate', sql.Date,dueDate).input('returndate',sql.Date, null).query(`
                INSERT INTO Action (bookid, personid, borrowdate, duedate, returndate)
                VALUES (${bookId},${uId},@borrowdate, @duedate ,@returndate)
              `);

              // reducing the number of book 
              await transaction.request().query(`
              UPDATE Book SET quantity = quantity - 1 WHERE bookid = ${bookId}
            `);
              //getting the transaction detail 
              const getTransactionId= await transaction.request().query(`
                SELECT TOP (1) transactionid, bookid FROM Action ORDER BY transactionid DESC
              `);
             await transaction.commit()
              res.send(`your transaction ID is ${getTransactionId.recordset[0].transactionid} and book id is ${getTransactionId.recordset[0].bookid} keep it secure , you wont be able to return it without these info`);
            }
          catch (error) {
            await transaction.rollback()
            throw error;
          }
        } 

      else{
        res.send("Sorry !  You are not authorised!")
      }
      } 
      catch (error) {
          console.error('Error:', error);
          res.status(500).send('Internal Server Error');
    } finally {
      // Close the database connection
      // await pool.close();
    }
  });


  app.post('/return', async (req, res) => {
    console.log("requesthit")
    try {
      
      const tId = req.body.tid;
      const bookId = req.body.bid;
      console.log(tId,bookId)
      
      // Connect to the database
      var pool = await sql.connect(config);

      // check if the person is authorised 
      const result = await pool.request().query(`
      SELECT * from action where transactionId= ${tId} and bookid = ${bookId} and returndate is NULL`)

      console.log(result)
      
      if (result.recordset.length == 1) {
        const transaction = new sql.Transaction(pool);

        await transaction.begin()
        try {
            // set the return date 
            await transaction.request().input('returndate',sql.Date, getCurrentDay()).query(
              `Update action set returndate = @returndate where bookid = ${bookId} and transactionid = ${tId}`)

              console.log("updating transaction")
            
            // update  the  quantity
            await transaction.request().query(
                `UPDATE Book SET quantity = quantity + 1 WHERE bookid = ${bookId}`)


            await transaction.commit()
            res.send("book returned")

          }
        catch(err){
          await transaction.rollback()
          res.send("err")
        }
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
      // await pool.close();
    }
  });


    // Route to fetch a book by ID
    app.get('/search', async (req, res) => {
      try {
        const bookName = req.query.bookName;
        const author = req.query.author;
        const genre = req.query.genre;

        let query = 'SELECT * FROM book WHERE 1=1';
        if(bookName) {
          query = query + ` and bookName = '${bookName}'`;
        }

        if(author) {
          query = query + ` and author = '${author}'`;
        }

        if(genre) {
          query = query + ` and genre = '${genre}'`;
        }
        
        query += "and quantity > 0"
        // Connect to the database
        await sql.connect(config);
    
        console.log(query)
        // Query to fetch a book by ID
        await sql.query(query).then(result => {
          if (result.recordset.length > 0) {
            // Book found, send the book data as a JSON response
            console.log(result.recordset)
            res.json(result.recordset);
          }
          else{
            res.send("book not found");
          }

        });
      } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
      } finally {
        // Close the database connection
        await sql.close();
      }
    });
  

 // Serve the HTML file when the root URL is requested
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

  // app.get('return/', (req, res) => {
  //   res.sendFile(path.join(__dirname, 'return.html'));
  // });

  // Start the server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
