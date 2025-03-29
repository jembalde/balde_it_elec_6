const express = require('express');
const app = express();
const bodyparser = require("body-parser"); 
// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Fix CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

// Fix console.log typo in logging middleware
app.use((req, res, next) => {
  console.log('First Middleware');
  next();
});

// GET endpoint for fetching posts
app.get('/api/posts', (req, res) => {
  const posts = [
    {
      id: 'snkfkjkf',
      title: 'First server-side post',
      content: 'This is coming from the server'
    },
    {
      id: 'gyrrshjhk',
      title: 'Second server-side post',
      content: 'This is coming from the server'
    }
  ];
  
  res.status(200).json({
    message: 'Posts fetched successfully!',
    posts: posts
  });
});

// POST endpoint for creating posts
app.post("/api/posts", (req, res, next) => {
  const post = {
    id: Date.now().toString(),
    title: req.body.title,
    content: req.body.content
  };
  console.log('Post created:', post);
  res.status(201).json({
    message: 'Post added successfully',
    post: post  // Send back the created post
  });
});

module.exports = app; 