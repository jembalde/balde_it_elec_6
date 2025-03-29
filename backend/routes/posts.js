const express = require('express');
const router = express.Router();
const Post = require('../models/post');

// GET all posts
router.get('', (req, res, next) => {
  Post.find()
    .then(documents => {
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: documents
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching posts failed!',
        error: error.message
      });
    });
});

// GET single post
router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: 'Post not found!' });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching post failed!',
        error: error.message
      });
    });
});

// POST new post
router.post('', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  
  post.save()
    .then(createdPost => {
      res.status(201).json({
        message: 'Post added successfully',
        post: {
          id: createdPost._id,
          title: createdPost.title,
          content: createdPost.content
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Creating post failed!',
        error: error.message
      });
    });
});

// PUT update post
router.put('/:id', (req, res, next) => {
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content
  });
  
  Post.updateOne({ _id: req.params.id }, post)
    .then(result => {
      if (result.modifiedCount > 0) {
        res.status(200).json({ message: 'Update successful!' });
      } else {
        res.status(404).json({ message: 'Post not found!' });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Updating post failed!',
        error: error.message
      });
    });
});

// DELETE post
router.delete('/:id', (req, res, next) => {
  Post.deleteOne({ _id: req.params.id })
    .then(result => {
      if (result.deletedCount > 0) {
        res.status(200).json({ message: 'Post deleted!' });
      } else {
        res.status(404).json({ message: 'Post not found!' });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Deleting post failed!',
        error: error.message
      });
    });
});

module.exports = router;
