import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { loadSecret } from "utils"

let JWT_SECRET: string = '';

if (process.env.NODE_ENV === 'production') {
  JWT_SECRET = loadSecret('JWT_SECRET') || '';
} else {
  JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';
}

interface JwtPayload {
  id: string;
  username: string;
  iat: number;
  exp: number;
}

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
  };
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication token missing or invalid' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = { id: decoded.id, username: decoded.username };
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
