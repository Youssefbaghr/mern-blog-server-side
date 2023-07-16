import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import httpStatus from 'http-status-codes';
import mongoose from 'mongoose';
import errorHandler from './Middleware/errorHandler.js';
import connetcToMongoDB from './db/db.js';
import AuthRoute from './Routes/AuthRoute.js';
import UserRoute from './Routes/UserRoute.js';
import PostRoute from './Routes/PostRoute.js';
import { notFound } from './Routes/NotFound.js';
import ImgRoute from './Routes/ImgUploadRoute.js';
import morgan from 'morgan';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 4097;

// Database connection
mongoose.set('strictQuery', true);
connetcToMongoDB();

// Configaration
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(cookieParser());
dotenv.config();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

// Route handlers
app.use('/api', AuthRoute);
app.use('/api', UserRoute);
app.use('/api', PostRoute);

//img upload route
app.use('/api', ImgRoute);

// 404 Route
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
