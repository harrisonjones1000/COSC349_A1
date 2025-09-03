const express = require('express');      
const mysql = require('mysql2/promise');  //promise lets you await queries instead of dealing with callback functions

const app = express();
const port = 3000;

app.use(express.json());                   
app.use(express.urlencoded({ extended: true })); 

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
app.get('/test-db', async (req, res) => { 
  try {
    const [rows] = await pool.query('SELECT 1 AS success;');
    res.json({ dbConnected: true, result: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ dbConnected: false, error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Middleware server running at http://localhost:${port}`);
});
