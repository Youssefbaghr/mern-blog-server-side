import mongoose from 'mongoose';
import Post from '../Models/PostModels.js';
import User from '../Models/UserModels.js';
import expressAsyncHandler from 'express-async-handler';
const { Types } = mongoose;

const getAll = expressAsyncHandler(async (req, res) => {
    try {
        const posts = await Post.find();
        if (posts.length > 0) {
            res.status(200).json(posts);
        } else {
            res.json('There are no posts');
        }
    } catch (error) {
        console.error('Failed to get posts:', error);
        res.status(500).json({ error: 'Failed to get posts.' });
    }
});

const getById = expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
        const post = await Post.findById(id);
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ error: 'Post not found.' });
        }
    } catch (error) {
        console.error('Failed to get post:', error);
        res.status(500).json({ error: 'Failed to get post.' });
    }
});

const searchPosts = expressAsyncHandler(async (req, res) => {
    const { searchTerm } = req.query;

    try {
        if (searchTerm.length > 0) {
            const posts = await Post.find().lean();
            if (posts.length > 0) {
                const matchingPosts = posts.filter((post) =>
                    post.title.toLowerCase().includes(searchTerm.toLowerCase())
                );
                if (matchingPosts.length > 0) {
                    res.status(200).json(matchingPosts);
                } else {
                    res.json('No posts found with this title');
                }
            } else {
                res.json('No posts found');
            }
        } else {
            res.json('No posts found');
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to search posts.' });
    }
});

const createPost = expressAsyncHandler(async (req, res) => {
    const { title, content, AuthorID, summary } = req.body;
    const Img = req.file.filename;

    if (!title || !content || !AuthorID || !summary) {
        return res
            .status(400)
            .json({ error: 'Please provide all required fields.' });
    }

    try {
        if (!Types.ObjectId.isValid(AuthorID)) {
            return res
                .status(400)
                .json({ message: 'this author is not valid.' });
        }

        const user = await User.findById(AuthorID);
        if (!user) {
            return res.status(404).json({ error: 'Author not found.' });
        }

        const post = new Post({
            title,
            content,
            AuthorID,
            Author: user.username,
            Img,
            Likes: [],
            summary,
        });

        await post.save();

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create post.' });
    }
});

const updatePost = expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
    const { title, content, Author, Img, summary } = req.body;
    const newpost = { title, content, Author, Img, summary };
    try {
        const post = await Post.findByIdAndUpdate(id, newpost, { new: true });
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ error: 'Post not found.' });
        }
    } catch (error) {
        console.error('Failed to update post:', error);
        res.status(500).json({ error: 'Failed to update post.' });
    }
});

const deletePost = expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
        const post = await Post.findByIdAndDelete(id);
        if (post) {
            res.json({ message: 'Post deleted successfully.' });
        } else {
            res.status(404).json({ error: 'Post not found.' });
        }
    } catch (error) {
        console.error('Failed to delete post:', error);
        res.status(500).json({ error: 'Failed to delete post.' });
    }
});

const likePost = expressAsyncHandler(async (req, res) => {
    const { userId, postId } = req.body;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found.' });
        }
        if (post.Likes.includes(userId)) {
            return res
                .status(400)
                .json({ error: 'User already liked this post.' });
        }
        post.Likes.push(userId);
        await post.save();
        res.status(200).json({
            message: 'post liked successfully',
            Likes: post.Likes,
        });
    } catch (error) {
        console.error('Failed to like post:', error);
        res.status(500).json({ error: 'Failed to like post.' });
    }
});

const unlikePost = expressAsyncHandler(async (req, res) => {
    const { userId, postId } = req.body;

    try {
        const post = await Post.findById(postId);
        if (!post.Likes.includes(userId)) {
            return res
                .status(400)
                .json({ error: 'User has not liked this post.' });
        }

        const updatedPost = await Post.findOneAndUpdate(
            { _id: postId },
            { $pull: { Likes: userId } },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ error: 'Post not found.' });
        }

        res.status(200).json({
            message: 'Post has been unliked.',
            Likes: updatedPost.Likes,
        });
    } catch (error) {
        console.error('Failed to unlike post:', error);
        res.status(500).json({ error: 'Failed to unlike post.' });
    }
});

export {
    getAll,
    getById,
    searchPosts,
    updatePost,
    createPost,
    deletePost,
    likePost,
    unlikePost,
};
