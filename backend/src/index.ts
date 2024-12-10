// src/index.ts or src/server.ts
import express, { Application, Request, Response } from 'express';
import { errorHandler } from "@middleware/errorHandler";
import cors from 'cors';
import * as dotenv from "dotenv";
import mongoose from 'mongoose';
import taskRoutes from '@routes/taskRoutes';
import authRoutes from '@routes/authRoutes';
import fs from 'fs';


// Load environment variables
dotenv.config();

// Initialize Express app
const app: Application = express();
const PORT = process.env.PORT || 4000;
const envionment = process.env.NODE_ENV || 'development';

if (envionment === 'development') {
  const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  }

  app.use(cors(corsOptions));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/eisenhower_dev';
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Routes
app.get('/', (_req: Request, res: Response) => {
  res.send('Welcome to the Eisenhower Matrix API');
});

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start the Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
