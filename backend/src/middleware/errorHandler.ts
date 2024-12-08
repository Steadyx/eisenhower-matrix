import { Request, Response, NextFunction } from "express";
import mongoose from 'mongoose';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(err.stack);

  if (res.headersSent) {
    return;
  }

  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({ error: err.message });
    return;
  }

  // Mongoose duplicate key error
  if (err.code && err.code === 11000) {
    res.status(409).json({ error: 'Duplicate key error', details: err.keyValue });
    return;
  }

  // JWT authentication error
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  // Default to 500 server error
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
};
