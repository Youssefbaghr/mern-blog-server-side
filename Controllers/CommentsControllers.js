import mongoose from 'mongoose';
import Post from '../Models/PostModels.js';
import User from '../Models/UserModels.js';
import expressAsyncHandler from 'express-async-handler';
const { Types } = mongoose;

const isValidObjectId = (id) => {
    return Types.ObjectId.isValid(id);
};

const createComment = expressAsyncHandler(async (req, res) => {
    const postId = req.params.id;
    const { authorID, content } = req.body;

    if (!authorID || !content) {
        return res.status(400).json({
            error: 'Please provide authorID and content for the comment.',
        });
    }

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found.' });
        }

        if (!isValidObjectId(authorID)) {
            return res.status(400).json({ error: 'User Not Found.' });
        }

        const user = await User.findById(authorID);
        if (!user) {
            return res.status(400).json({ error: 'User not found.' });
        } else {
            const comment = {
                authorID: user._id,
                content,
                createdAt: new Date(),
            };

            post.comments.push(comment);
            await post.save();

            res.status(201).json('comment created succes');
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to create comment.' });
    }
});

const updateComment = expressAsyncHandler(async (req, res) => {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const { authorID, content } = req.body;

    if (!authorID || !content) {
        return res.status(400).json({
            error: 'Please provide author and content for the comment.',
        });
    }

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found.' });
        }

        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found.' });
        }

        if (!isValidObjectId(authorID)) {
            return res.status(400).json({ error: 'User not found.' });
        }

        const user = await User.findById(authorID);
        if (!user) {
            return res.status(400).json({ error: 'User not found.' });
        }

        if (comment.authorID.toString() !== user._id.toString()) {
            return res.status(403).json({
                error: 'You are not authorized to update this comment.',
            });
        }

        comment.authorID = user._id.toString();
        comment.content = content;
        await post.save();

        res.status(200).json({ message: 'comment credit succesfull' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update comment.' });
    }
});

const deleteComment = expressAsyncHandler(async (req, res) => {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const authorID = req.body;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found.' });
        }

        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found.' });
        }

        if (comment.authorID.toString() === authorID.authorID) {
            comment.remove();
            await post.save();

            res.json(post.comments);
        } else {
            return res.status(403).json({
                error: 'You are not authorIDized to delete this comment.',
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete comment.' });
    }
});

const likeComment = expressAsyncHandler(async (req, res) => {
    const { userId, commentId, postId } = req.body;
    try {
        const updatedPost = await Post.findOneAndUpdate(
            {
                _id: postId,
                'comments._id': commentId,
                'comments.Likes': { $ne: userId },
            },
            {
                $addToSet: { 'comments.$.Likes': userId },
                $pull: { 'comments.$.Dislikes': userId },
            },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(400).json({
                error: 'User already liked this comment or comment not found.',
            });
        }

        res.status(200).json({ message: 'Comment liked successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to like comment.' });
    }
});

const dislikeComment = expressAsyncHandler(async (req, res) => {
    const { userId, commentId, postId } = req.body;
    try {
        const updatedPost = await Post.findOneAndUpdate(
            {
                _id: postId,
                'comments._id': commentId,
                'comments.Dislikes': { $ne: userId },
            },
            {
                $addToSet: { 'comments.$.Dislikes': userId },
                $pull: { 'comments.$.Likes': userId },
            },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(400).json({
                error: 'User already disliked this comment or comment not found.',
            });
        }

        res.status(200).json({ message: 'Comment disliked successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to dislike comment.' });
    }
});

export {
    createComment,
    updateComment,
    deleteComment,
    likeComment,
    dislikeComment,
};
