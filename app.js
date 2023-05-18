require('dotenv').config()
const express = require('express')
const app = express()
const port = 3001
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
      await sql.connect(dbConfig);
  
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
  
  // Serve the HTML file when the root URL is requested
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'library.html'));
  });

  // Start the server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
