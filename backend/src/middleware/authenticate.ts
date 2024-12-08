import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

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
  console.log("Token:", token);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    console.log("Decoded Token:", decoded);
    req.user = { id: decoded.id, username: decoded.username };
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
