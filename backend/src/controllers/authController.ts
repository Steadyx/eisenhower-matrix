import { RequestHandler } from 'express';
import * as authService from '@services/authService';

interface RegisterBody {
  uniqueID: string;
}

export const register: RequestHandler<{}, any, RegisterBody> = async (req, res, _next) => {
  try {
    const { uniqueID } = req.body;

    if (!uniqueID) {
      res.status(400).json({ error: 'Unique ID is required' });
      return;
    }

    const existingUser = await authService.findUserByUniqueID(uniqueID);
    if (existingUser) {
      res.status(409).json({ error: 'Unique ID already in use' });
      return;
    }

    const username = authService.generateUsername(uniqueID);
    const hashedID = await authService.hashID(uniqueID);
    const user = await authService.register(username, hashedID, uniqueID);

    const token = authService.generateJWT(user);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      username: user.username,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const login: RequestHandler<{}, any, RegisterBody> = async (req, res, _next) => {
  try {
    const { uniqueID } = req.body;

    if (!uniqueID) {
      res.status(400).json({ error: 'Unique ID is required' });
      return;
    }

    const user = await authService.authenticate(uniqueID);

    if (!user) {
      res.status(401).json({ error: 'Invalid Unique ID' });
      return;
    }

    const token = authService.generateJWT(user);

    res.status(200).json({ token, username: user.username });
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
