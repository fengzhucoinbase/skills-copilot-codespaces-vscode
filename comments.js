// Create web server
// Load modules
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Comment = require('./models/comment');
var app = express();
// Connection to database
mongoose.connect('mongodb://localhost/comments');
// Configure server
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 8080;
// Create router
var router = express.Router();
// Middleware for all requests
router.use(function(req, res, next) {
    console.log('Something is happening.');
    next();
});
// Test route
router.get('/', function(req, res) {
    res.json({ message: 'Welcome to our api!' });
});
// Routes for /comments
router.route('/comments')
    // Create a comment
    .post(function(req, res) {
        var comment = new Comment();
        comment.name = req.body.name;
        comment.comment = req.body.comment;
        comment.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'Comment created!' });
        });
    })
    // Get all comments
    .get(function(req, res) {
        Comment.find(function(err, comments) {
            if (err)
                res.send(err);
            res.json(comments);
        });
    });
// Routes for /comments/:comment_id
router.route('/comments/:comment_id')
    // Get comment with that id
    .get(function(req, res) {
        Comment.findById(req.params.comment_id, function(err, comment) {
            if (err)
                res.send(err);
            res.json(comment);
        });
    })
    // Update comment with that id
    .put(function(req, res) {
        Comment.findById(req.params.comment_id, function(err, comment) {
            if (err)
                res.send(err);
            comment.name = req.body.name;
            comment.comment = req.body.comment;
            comment.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'Comment updated!' });
            });
        })