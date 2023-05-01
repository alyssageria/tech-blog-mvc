const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

// GET '/dashboard' -renders the dashboard with existing blog posts
router.get('/', withAuth, async (req, res) => {
    try {
        const currentUser = req.session.user_id;
        const postData = await Post.findAll({
            where: { user_id: currentUser },
            attributes: [
                'id',
                'title',
                'post_content',
                'created_at'
            ],
            include: [
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        });

        const posts = postData.map((post) => post.get({ plain: true }));

        res.render('dashboard', {
            posts,
            username: req.session.username,
            loggedIn: req.session.loggedIn
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// GET '/dashboard/new' - renders the page to create a new blog post
router.get('/new', withAuth, (req, res) => {
    res.render('newBlogPost', {
        user_id: req.session.user_id,
        loggedIn: req.session.loggedIn
    })
})

// GET '/dashboard/edit/:id' - Renders the page to edit an existing blog post
router.get('/edit/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.findOne({
            where: {
                id: req.params.id
            },
            attributes: [
                'id',
                'title',
                'post_content',
                'created_at'
            ],
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                },
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        });

        if (!postData) {
            res.status(404).json({
                message: 'No post found with this id'
            });
            return;
        }

        const post = postData.get({
            plain: true
        });

        res.render('editBlogPost', {
            post,
            loggedIn: req.session.loggedIn
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;