import crypto from 'crypto';
import bcrypt from 'bcrypt';
import fs from 'fs';

/**
 * Load a Docker secret from the secrets directory.
 * @param {string} secretName - The name of the secret to load.
 * @returns {string} The value of the secret.
 */
export const loadSecret = (secretName: string): string => {
  const path = '/run/secrets/';

  try {
    const secretPath = `${path}${secretName}`;
    return fs.readFileSync(secretPath, 'utf8').trim();
  } catch (error) {
    console.error(`Error loading secret: ${secretName} returning empty string`, error);
    return '';
  }
}
/**
 * Generates a cryptographically secure unique ID.
 * @returns {string} A 128-bit (16-byte) hexadecimal string.
 */
export const generateUniqueID = (): string => {
  return crypto.randomBytes(16).toString('hex'); // 128-bit ID represented in hex
};

/**
 * Generates a username based on the provided unique ID.
 * @param {string} id - The unique ID to base the username on.
 * @returns {string} A formatted username string.
 */
export const generateUsername = (id: string): string => {
  // Ensure the ID is long enough
  if (id.length < 8) {
    throw new Error('ID is too short to generate a username.');
  }
  return `user_${id.slice(0, 8)}`;
};

/**
 * Hashes the provided unique ID using bcrypt.
 * @param {string} id - The unique ID to hash.
 * @returns {Promise<string>} The hashed ID.
 */
export const hashID = async (id: string): Promise<string> => {
  const saltRounds = 12;
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashed = await bcrypt.hash(id, salt);
    return hashed;
  } catch (error) {
    throw new Error('Error hashing the unique ID.');
  }
};

/**
 * Compares a plain unique ID with its hashed version.
 * @param {string} id - The plain unique ID provided by the user.
 * @param {string} hash - The hashed unique ID stored in the database.
 * @returns {Promise<boolean>} Whether the IDs match.
 */
export const compareID = async (id: string, hash: string): Promise<boolean> => {
  try {
    const isMatch = await bcrypt.compare(id, hash);
    return isMatch;
  } catch (error) {
    throw new Error('Error comparing the unique ID.');
  }
};
