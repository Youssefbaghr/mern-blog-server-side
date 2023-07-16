import User from '../Models/UserModels.js';
import expressAsyncHandler from 'express-async-handler';
import validator from 'validator';
import Post from '../Models/PostModels.js';

const getAll = expressAsyncHandler(async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get users.' });
    }
});

const getById = expressAsyncHandler(async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to get user.' });
    }
});

const updateUser = expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
    const { username, email, profileImg, bio } = req.body;
    const newUser = { username, email, profileImg, bio };

    // Validate email
    if (email && !validator.isEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    try {
        if (req.file) {
            newUser.profileImg = req.file.filename;
        }

        const updatedUser = await User.findByIdAndUpdate(id, newUser, {
            new: true,
        });

        if (updatedUser) {
            // Update the username in the posts
            await Post.updateMany(
                { AuthorID: id },
                { Author: updatedUser.username }
            );

            // Send the updated user information in the response
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ error: 'User not found.' });
        }

        if (updatedUser) {
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ error: 'User not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user.' });
    }
});

const deleteUser = expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findByIdAndDelete(id);
        if (user) {
            res.json({ message: 'User deleted successfully.' });
        } else {
            res.status(404).json({ error: 'User not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user.' });
    }
});

const followUser = async (req, res) => {
    const { userId, followId } = req.params;
    try {
        const user = await User.findById(userId);
        const followUser = await User.findById(followId);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        if (!followUser) {
            return res.status(404).json({ error: 'Follow user not found.' });
        }

        if (user.following.includes(followId)) {
            return res
                .status(400)
                .json({ error: 'User is already following this user.' });
        }

        user.following.push(followId);
        followUser.follower.push(userId);

        await user.save();
        await followUser.save();

        res.status(200).json({ 'user followed by': followUser.username });
    } catch (error) {
        res.status(500).json({ error: 'Failed to follow user.' });
    }
};

const unfollowUser = async (req, res) => {
    const { userId, unfollowId } = req.params;
    try {
        const user = await User.findById(userId);
        const unfollowUser = await User.findById(unfollowId);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        if (!unfollowUser) {
            return res.status(404).json({ error: 'Unfollow user not found.' });
        }

        if (!user.following.includes(unfollowId)) {
            return res
                .status(400)
                .json({ error: 'User is not following this user.' });
        }

        user.following = user.following.filter(
            (id) => id.toString() !== unfollowId.toString()
        );
        unfollowUser.follower = unfollowUser.follower.filter(
            (id) => id.toString() !== userId.toString()
        );

        await user.save();
        await unfollowUser.save();

        res.status(200).json({
            message: `User ${unfollowUser.username} unfollowed by ${user.username}.`,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to unfollow user.' });
    }
};

export { getAll, getById, updateUser, deleteUser, followUser, unfollowUser };
