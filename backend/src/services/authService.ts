import User, { IUser } from '@models/User';
import { generateUniqueID, generateUsername, hashID, compareID } from '../utils';
import jwt from 'jsonwebtoken';
import { loadSecret } from 'utils'

/**
 * Finds a user by their uniqueID.
 * @param uniqueID - The unique identifier provided by the user.
 * @returns The user if found, otherwise null.
 */
export const findUserByUniqueID = async (uniqueID: string): Promise<IUser | null> => {
  return await User.findOne({ uniqueID });
};

/**
 * Registers a new user with username, hashedID, and uniqueID.
 * @param username - Generated username.
 * @param hashedID - Hashed version of uniqueID.
 * @param uniqueID - The unique identifier provided by the user.
 * @returns The newly created user.
 * @throws Error if username or uniqueID already exists.
 */
export const register = async (
  username: string,
  hashedID: string,
  uniqueID: string
): Promise<IUser> => {
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error('Username already exists');
  }

  const existingUniqueID = await findUserByUniqueID(uniqueID);
  if (existingUniqueID) {
    throw new Error('Unique ID already in use');
  }

  const user = new User({ username, hashedID, uniqueID });
  await user.save();
  return user;
};

/**
 * Authenticates a user by their uniqueID.
 * @param uniqueID - The unique identifier provided by the user.
 * @returns The authenticated user if credentials are valid, otherwise null.
 */
export const authenticate = async (uniqueID: string): Promise<IUser | null> => {
  const user = await User.findOne({ uniqueID });

  if (!user) return null;

  const isMatch = await compareID(uniqueID, user.hashedID);
  return isMatch ? user : null;
};

/**
 * Generates a JWT token for a user.
 * @param user - The user for whom to generate the token.
 * @returns A signed JWT token.
 */
export const generateJWT = (user: IUser): string => {
  const payload = { id: user._id, username: user.username };
  let secret;

  if (process.env.NODE_ENV !== 'production') {
    secret = process.env.JWT_SECRET || 'default_secret';

    if (!process.env.JWT_SECRET) {
      console.warn('JWT_SECRET is not set! Falling back to default_secret.');
    }
  } else {
    secret = loadSecret('jwt_secret');

    if (!secret) {
      throw new Error('JWT secret could not be loaded in production!');
    }
  }

  const options = { expiresIn: '1h' };
  return jwt.sign(payload, secret, options);
};

export { generateUniqueID, generateUsername, hashID, compareID };
