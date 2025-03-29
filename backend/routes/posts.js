const express = require('express');
const multer = require('multer');
const router = express.Router();
const Post = require('../models/post');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('_');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

// GET all posts
router.get('', (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;

  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: fetchedPosts,
        maxPosts: count
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
router.post('', multer({storage: storage}).single("image"), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });
  
  post.save()
    .then(createdPost => {
      res.status(201).json({
        message: 'Post added successfully',
        post: {
          ...createdPost.toObject(),
          id: createdPost._id
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
router.put("/:id", multer({storage: storage}).single("image"), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  Post.updateOne({ _id: req.params.id }, post)
    .then(result => {
      if (result.modifiedCount > 0) {
        res.status(200).json({
          message: "Update successful!",
          imagePath: imagePath
        });
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Updating post failed!",
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
