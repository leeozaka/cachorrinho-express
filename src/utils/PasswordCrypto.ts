import * as crypto from 'crypto';

/**
 * Utility class for handling password and token cryptography operations
 * @class PasswordCrypto
 */
export default class PasswordCrypto {
  /**
   * Creates a SHA-256 hash from a given token or password
   * @param {string} token - The token or password to hash
   * @returns {string} The generated hash
   * @throws {Error} If token is not provided
   */
  static hashToken(token: string): string {
    if (!token) {
      throw new Error('Token is required');
    }
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Generates a random token
   * @param {number} length - Length of the token to generate
   * @returns {string} The generated token
   */
  static generateToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Compares a plain text password with its hash
   * @param {string} plainText - The plain text password
   * @param {string} hash - The hashed password to compare against
   * @returns {boolean} True if the passwords match
   */
  static compareHash(plainText: string, hash: string): boolean {
    if (!plainText || !hash) {
      return false;
    }
    return this.hashToken(plainText) === hash;
  }
}
