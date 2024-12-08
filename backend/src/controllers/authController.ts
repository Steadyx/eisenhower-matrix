import { Request, Response } from 'express';
import * as authService from '@services/authService';

export const register = async (req: Request, res: Response) => {
  try {
    const { uniqueID } = req.body;

    if (!uniqueID) {
      return res.status(400).json({ error: 'Unique ID is required' });
    }

    const existingUser = await authService.findUserByUniqueID(uniqueID);
    if (existingUser) {
      return res.status(409).json({ error: 'Unique ID already in use' });
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

export const login = async (req: Request, res: Response) => {
  try {
    const { uniqueID } = req.body;

    if (!uniqueID) {
      return res.status(400).json({ error: 'Unique ID is required' });
    }

    const user = await authService.authenticate(uniqueID);

    if (!user) {
      return res.status(401).json({ error: 'Invalid Unique ID' });
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
