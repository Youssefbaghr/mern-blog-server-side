import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../Models/UserModels.js';

const jwtsecret = 'jhgfvhljvhlvlh6794576476RGCKGCGJ';

const protect = asyncHandler(async (req, res, next) => {
    let token;
    token = req.cookies.token;

    if (token) {
        try {
            // Verify token
            const decoded = jwt.verify(token, jwtsecret);

            // Get user from the token
            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized' });
            console.error(error);
        }
    } else if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
});

export default protect;
