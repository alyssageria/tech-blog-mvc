const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// GET '/api/comments - Get all comments
router.get("/", async (req, res) => {
    try {
        const commentData = await Comment.findAll();
        res.json(commentData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// POST '/api/comments create a comment
router.post('/', withAuth, async (req, res) => {
    try {
        if (req.session) {
            const commentData = await Comment.create({
                comment_text: req.body.comment_text,
                post_id: req.body.post_id,
                user_id: req.session.user_id
            });
            res.json(commentData);
        }
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

module.exports = router;