import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const mongodbUrl = 'Your MongoDB Key';

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(mongodbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000,
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
    }
};

export default connectToMongoDB;
