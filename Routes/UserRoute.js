import { Router } from 'express';
import {
    getAll,
    getById,
    updateUser,
    deleteUser,
    followUser,
    unfollowUser,
} from '../Controllers/UserController.js';
import protect from '../Middleware/authMiddleware.js';
import { upload } from '../Controllers/ImgUploadCntrollres.js';

const router = Router();

// Define the routes
router.get('/users', protect, getAll);
router.get('/users/:id', protect, getById);
router.put(
    '/users/update/:id',
    protect,
    upload.single('profileImg'),
    updateUser
);
router.delete('/users/delete/:id', protect, deleteUser);
router.post('/users/:userId/follow/:followId', protect, followUser);
router.post('/users/:userId/unfollow/:unfollowId', protect, unfollowUser);

export default router;
