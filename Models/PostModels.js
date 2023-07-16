import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the Post schema
const postShema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Please enter a title'],
            unique: [true, 'The title must be unique'],
        },
        content: {
            type: String,
            required: [true, 'Please enter a content'],
        },
        summary: {
            type: String,
            required: [true, 'Please enter a summary'],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        Img: {
            type: String,
            required: false,
        },
        AuthorID: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User,',
        },
        Author: {
            type: String,
            required: true,
            ref: 'User,',
        },
        Likes: {
            type: [Schema.Types.ObjectId],
            default: [],
            ref: 'User',
        },
        comments: [
            {
                authorID: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                content: {
                    type: String,
                    required: true,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
                Likes: {
                    type: [Schema.Types.ObjectId],
                    default: [],
                    ref: 'User',
                },
                Deslikes: {
                    type: [Schema.Types.ObjectId],
                    default: [],
                    ref: 'User',
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Create the Post model
const Post = mongoose.model('Post', postShema);

export default Post;
