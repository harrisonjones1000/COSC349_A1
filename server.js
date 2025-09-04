const express = require('express');      
const mysql = require('mysql2/promise');  //promise lets you await queries instead of dealing with callback functions
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());                   
app.use(express.urlencoded({ extended: true })); 
app.use(cors()); // allow requests from any origin

const pool = mysql.createPool({
  host: '192.168.56.12',   
  user: 'webuser',         
  password: 'insecure_db_pw',
  database: 'fvision',     
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

//Exprss mathces the incoming HTTP request to the right route
//is asynch so we can use await inside
//await pauses the route handler until the DB responds (note other requests can be handled concurrently)
//if more than 10 connections, we wait for a free connection
//express then serialises object to json, sends it back
//browser / front end recieves it and processes
// Get Fibonacci number by id
app.get('/fib/:n', async (req, res) => {
  const n = parseInt(req.params.n, 10);

  // Validate input
  if (isNaN(n) || n < 1 || n > 100) {
    return res.status(400).json({ error: 'n must be an integer between 1 and 100' });
  }

  try {
    const [rows] = await pool.query('SELECT value FROM fib WHERE id = ?', [n]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Fibonacci number not found' });
    }
    res.json({ n, value: rows[0].value });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Middleware server running at http://0.0.0.0:${port}`);
});
