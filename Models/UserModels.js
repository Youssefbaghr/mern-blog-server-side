import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the User schema
const userSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, 'Please enter a username'],
            unique: [true, 'The name must be unique'],
            minlength: 5,
            maxlength: 100,
        },
        email: {
            type: String,
            required: [true, 'Please enter an email'],
            unique: [true, 'The email must be unique'],
        },
        password: {
            type: String,
            required: [true, 'Please enter a password'],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        profileImg: {
            type: [String],
            required: false,
            default:
                'https://www.shutterstock.com/image-vector/man-icon-vector-260nw-1040084344.jpg',
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        follower: {
            type: [Schema.Types.ObjectId],
            ref: 'User',
        },
        following: {
            type: [Schema.Types.ObjectId],
            ref: 'User',
        },
        bio: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

// Create the User model
const User = mongoose.model('User', userSchema);

export default User;
