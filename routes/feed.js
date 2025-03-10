const express = require('express');
const { body } = require('express-validator');


const router = express.Router();

const feedController = require('../controllers/feed');
//first router
router.get('/posts', feedController.getPosts);

//router for post method
router.post(
    '/post',
[
    body('title')
    .trim()
    .isLength({ min: 5}),
    body('content')
    .trim()
    .isLength({ min : 5})

],
feedController.createPosts);

router.get('/post/:postId', feedController.getPost);
 router.put('/post/:postId',[
    body('title')
    .trim()
    .isLength({ min: 5}),
    body('content')
    .trim()
    .isLength({ min : 5})

], feedController.updatePost);

router.delete('/post/:postId', feedController.deletePost);

module.exports = router;

