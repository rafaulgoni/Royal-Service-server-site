const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json());





app.get('/', (req, res) => {
    res.send('Assignment_category_0002')
  });
  
  app.listen(port, () => {
    console.log(`Assignment_category_0002 server is running on port: ${port}`);
  })