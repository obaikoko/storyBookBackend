import express from 'express';
import dotenv from 'dotenv';
import userRoute from './routes/userRoute.js';
import bookRoute from './routes/bookRoute.js';
import { errorHandler, notFound } from './middleware/errorMiddlerware.js';
import connectDB from './config/db.js';
import colors from 'colors';
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();

connectDB();
const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/users', userRoute);
app.use('/api/books', bookRoute);
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server started on port ${port}`));
