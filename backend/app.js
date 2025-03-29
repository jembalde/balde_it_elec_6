const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const postsRoutes = require('./routes/posts');

const app = express();

// Connect to MongoDB - remove deprecated options
mongoose.connect('mongodb+srv://jemmongo:VuvTldACNAbtTUxa@cluster0.kx8s8.mongodb.net/node-angular')
.then(() => {
  console.log('Connected to database!');
})
.catch((error) => {
  console.log('Connection failed!', error.message);
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// CORS Headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});

// Routes
app.use('/api/posts', postsRoutes);

module.exports = app; 