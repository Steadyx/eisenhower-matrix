import { Request, Response } from 'express';
import * as authService from '@services/authService';


export const register = async (_req: Request, res: Response) => {
  try {
    const uniqueID = authService.generateUniqueID();
    const username = authService.generateUsername(uniqueID);
    const hashedID = await authService.hashID(uniqueID);
    const user = await authService.register(username, hashedID);

    res.status(201).json({
      message: 'User registered successfully',
      username: user.username,
      uniqueID // Consider sending this via a secure channel
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
};


export const login = async (req: Request, res: Response) => {
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

    res.status(200).json({ token });
    return; // You can also add return here
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
};
