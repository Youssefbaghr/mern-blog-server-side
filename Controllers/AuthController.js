import bcrypt from 'bcrypt';
import User from '../Models/UserModels.js';
import generateToken from '../utils/generateToken.js';
import validator from 'validator';
import expressAsyncHandler from 'express-async-handler';

// Register a new user
const Register = expressAsyncHandler(async (req, res) => {
    const { username, email, password, bio } = req.body;
    const profileImg = req.file.filename;

    if (!username || !email || !password) {
        return res
            .status(400)
            .json({ error: 'Please provide all required fields.' });
    } else {
        if (email && !validator.isEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        } else {
            const userExists = await User.findOne({ email });

            if (userExists) {
                res.status(400).json('User already exists');
            } else {
                // Hash the password
                try {
                    const saltRounds = 10;
                    const hashedPassword = await bcrypt.hash(
                        password,
                        saltRounds
                    );
                    const user = await User.create({
                        username,
                        email,
                        password: hashedPassword,
                        profileImg,
                        bio,
                    });

                    if (user) {
                        res.status(201).json({ user });
                    } else {
                        res.status(400).json('Invalid user data');
                    }
                } catch (error) {
                    res.status(500).json({ error: 'Failed to create user ' });
                }
            }
        }
    }
});

// Login an existing user
const Login = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res
            .status(400)
            .json({ error: 'Please provide all required fields.' });
    } else {
        if (email && !validator.isEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        } else {
            try {
                // Check if the user exists
                const user = await User.findOne({ email });
                if (!user) {
                    return res.status(401).json({ error: 'No user found' });
                } else {
                    // Compare passwords
                    const isPasswordValid = await bcrypt.compare(
                        password,
                        user.password
                    );
                    if (!isPasswordValid) {
                        return res
                            .status(401)
                            .json({ error: 'Invalid credentials' });
                    } else {
                        generateToken(res, user._id);
                        res.status(200).json({ user });
                    }
                }
            } catch (error) {
                res.status(500).json({ error: 'Failed to login' });
                console.error(error);
            }
        }
    }
});

// Logout an existing user
const logout = expressAsyncHandler((req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
});

export { Register, Login, logout };
