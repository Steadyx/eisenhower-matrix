import express, { Application, Request, Response } from 'express';
import { errorHandler } from "@middleware/errorHandler";
import cors from 'cors';
import * as dotenv from "dotenv";
import mongoose from 'mongoose';
import taskRoutes from '@routes/taskRoutes';
import authRoutes from '@routes/authRoutes';

dotenv.config();
const app: Application = express();
const PORT = process.env.PORT || 4000;
const envionment = process.env.NODE_ENV || 'development';
const isProduction = envionment === 'production';
let mongoUri: string;

if (!isProduction) {
  const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  }
  app.use(cors(corsOptions));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (isProduction) {
  mongoUri = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`;
} else {
  mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/eisenhower_dev'
}

mongoose
  .connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => console.log('Connected to MongoDB!'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Create an API router
const apiRouter = express.Router();

// Add routes to API router
apiRouter.get('/', (_req: Request, res: Response) => {
  res.send('Welcome to the Eisenhower Matrix API');
})

apiRouter.use('/auth', authRoutes);
apiRouter.use('/tasks', taskRoutes);

// Mount the API router with /api prefix
app.use('/api', apiRouter);

// Error Handling Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
  console.log(`Environment currently at: ${envionment}`);
});
