import { Router } from 'express';
import {
    getAll,
    getById,
    searchPosts,
    updatePost,
    createPost,
    deletePost,
    likePost,
    unlikePost,
} from '../Controllers/PostsControllers.js';
import {
    createComment,
    updateComment,
    deleteComment,
    dislikeComment,
    likeComment,
} from '../Controllers/CommentsControllers.js';
import protect from '../Middleware/authMiddleware.js';
import { upload } from '../Controllers/ImgUploadCntrollres.js';

const router = Router();

// Define the routes
router.get('/posts/search', searchPosts);
router.get('/posts/:id', getById);
router.get('/posts/', getAll);

router.post('/posts/create', protect, upload.single('Img'), createPost);
router.put('/posts/update/:id', protect, upload.single('Img'), updatePost);
router.delete('/posts/delete/:id', protect, deletePost);
router.put('/posts/like', protect, likePost);
router.put('/posts/unlike', protect, unlikePost);

// Comment routes
router.post('/posts/:id/comments/create', protect, createComment);
router.put('/posts/:postId/comments/update/:commentId', protect, updateComment);
router.delete(
    '/posts/:postId/comments/delete/:commentId',
    protect,
    deleteComment
);
router.put('/posts/comments/like', protect, likeComment);
router.put('/posts/comments/dislike', protect, dislikeComment);

export default router;
