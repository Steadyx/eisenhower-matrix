import User, { IUser } from '@models/User';
import { generateUniqueID, generateUsername, hashID, compareID } from '../utils';
import jwt from 'jsonwebtoken';

export const register = async (username: string, hashedID: string): Promise<IUser> => {
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error('Username already exists');
  }

  const user = new User({ username, hashedID });
  await user.save();
  return user;
};

export const authenticate = async (uniqueID: string): Promise<IUser | null> => {
  const username = generateUsername(uniqueID);
  const user = await User.findOne({ username });

  if (!user) return null;

  const isMatch = await compareID(uniqueID, user.hashedID);
  return isMatch ? user : null;
};

export const generateJWT = (user: IUser): string => {
  const payload = { id: user._id, username: user.username };
  const secret = process.env.JWT_SECRET || 'your_jwt_secret';
  const options = { expiresIn: '1h' };
  return jwt.sign(payload, secret, options);
};

export { generateUniqueID, generateUsername, hashID, compareID };
