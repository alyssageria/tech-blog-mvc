const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// GET '/api/posts' - Retrieves all existing blog posts
router.get("/", async (req, res) => {
    try {
        const posts = await Post.findAll({
            attributes: ["id", "post_content", "title", "created_at"],
            order: [["created_at", "DESC"]],
            include: [
                {
                    model: User,
                    attributes: ["username"],
                },
                {
                    model: Comment,
                    attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
                    include: {
                        model: User,
                        attributes: ["username"],
                    },
                },
            ],
        });
        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// GET '/api/posts/:id' - Retrieves a specific blog post
router.get("/:id", async (req, res) => {
    try {
        const postData = await Post.findOne({
            where: {
                id: req.params.id,
            },
            attributes: ["id", "post_content", "title", "created_at"],
            include: [
                {
                    model: User,
                    attributes: ["username"],
                },
                {
                    model: Comment,
                    attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
                    include: {
                        model: User,
                        attributes: ["username"],
                    },
                },
            ],
        });
        if (!postData) {
            res.status(404).json({
                message: "No post found with this id",
            });
            return;
        }
        res.json(postData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// POST '/api/posts' - creates a new blog post
router.post("/", withAuth, async (req, res) => {
    try {
        const postData = await Post.create({
            title: req.body.title,
            post_content: req.body.post_content,
            user_id: req.session.user_id,
        });

        res.json(postData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// PUT '/api/posts/:id' - Updates an existing blog post
router.put("/:id", withAuth, async (req, res) => {
    try {
        const postData = await Post.update({
            title: req.body.title,
            content: req.body.post_content,
        }, {
            where: {
                id: req.params.id,
            },
        });

        if (!postData[0]) {
            res.status(404).json({
                message: "No post found with this id"
            });
            return;
        }

        res.json(postData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// DELETE '/api/posts/:id' - Deletes a blog post
router.delete("/:id", withAuth, async (req, res) => {
    try {
        const postData = await Post.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id
            },
        });

        if (!postData) {
            res.status(404).json({ message: "No post found with this id" });
            return;
        }

        res.status(200).json(postData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;