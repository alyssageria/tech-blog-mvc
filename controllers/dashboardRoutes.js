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

        console.log(postData);
        const posts = postData.map((post) => post.get({ plain: true }));

        console.log(posts)
        res.render('dashboard', {
            posts,
            loggedIn: true
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// GET '/dashboard/new' - renders the page to create a new blog post
router.get('/new', (req, res) => {
    res.render('newBlogPost', {
        loggedIn: true
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
            loggedIn: true
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;