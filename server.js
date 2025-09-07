const express = require('express');      
const mysql = require('mysql2/promise');  //promise lets you await queries instead of dealing with callback functions
const cors = require('cors');

const app = express(); 
const port = 3000;

app.use(express.json()); //middleware to parse JSON bodies              
app.use(express.urlencoded({ extended: true })); //middleware to parse URL-encoded bodies
app.use(cors()); // allow requests from any origin

// create a connection pool to the mysql db server
const pool = mysql.createPool({
  host: '192.168.56.12', //IP od DB VM
  user: 'webuser',         
  password: 'insecure_db_pw',
  database: 'fvision',     
  waitForConnections: true, // wait for a free connection if pool is full
  connectionLimit: 10,      // maximum simultaneous connections
  queueLimit: 0             
});

// Express matches HTTP request to this route to get fionacci number by id
// Async route so we can use await for database calls
app.get('/fib/:n', async (req, res) => {
  const n = parseInt(req.params.n, 10);

  // Validate input
  if (isNaN(n) || n < 1 || n > 100) {
    return res.status(400).json({ error: 'n must be an integer between 1 and 100' });
  }

  try {
    // generate sql result from prepared statement
    const [rows] = await pool.query('SELECT value FROM fib WHERE id = ?', [n]); 
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Fibonacci number not found' });
    }

    // send JSON response with the requested fibonacci number
    res.json({ n, value: rows[0].value });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Start Express server and listen on all network interfaces (0.0.0.0)
// This allows other VMs or the host to reach this server
app.listen(port, '0.0.0.0', () => {
  console.log(`Middleware server running at http://0.0.0.0:${port}`);
});
