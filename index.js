// Importing required modules
const express = require('express');


const app = express();
const port = 3000; // Port number for the server to listen on


app.set('view engine', 'ejs');
app.set('views','./views');
app.use(express.static('./assets'));

// Define a route handler for a custom path
app.use('/', require('./routers/index'));

// Start the server and listen for incoming requests
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
