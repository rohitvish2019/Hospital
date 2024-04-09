const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = 8000;

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'System##54',
  database: 'hospital'
});

// Connect to MySQL
connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL database: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

// Define routes
app.get('/', (req, res) => {
  // Sample query to fetch data from MySQL
  connection.query('SELECT * FROM your_table_name', (error, results) => {
    if (error) {
      console.error('Error querying MySQL database: ' + error.stack);
      res.status(500).send('Internal Server Error');
      return;
    }
    // Send the fetched data as response
    res.json(results);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
