import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/secret';
import { UserService } from 'services/UserService';
import { EntityAttribute, EntityType } from 'enums/ErrorTypes';
import JwtPayload from 'interfaces/JwtPayloadInterface';
import { ResultAsync, errAsync, okAsync } from 'neverthrow';

/**
 * Authentication middleware to protect routes
 * Validates JWT token and attaches user to request
 */
export const authenticate =
  (userService: UserService) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const validateToken = (): ResultAsync<string, Error> => {
      const authHeader = req.headers.authorization;

      if (!authHeader?.startsWith('Bearer ')) {
        return errAsync(new Error('Invalid or missing authentication token'));
      }

      if (!JWT_SECRET) {
        return errAsync(new Error('JWT secret is not configured'));
      }

      return okAsync(authHeader.split(' ')[1]);
    };

    const verifyToken = (token: string): ResultAsync<string, Error> => {
      try {
        const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;
        return decoded.userId
          ? okAsync(decoded.userId)
          : errAsync(new Error('Invalid token payload'));
      } catch {
        return errAsync(new Error('Invalid token'));
      }
    };

    const result = await validateToken()
      .andThen(verifyToken)
      .andThen((userId) => userService.findOne(userId))
      .andThen((user) => {
        if (!user) {
          return errAsync(new Error('User not found'));
        }
        if (req.method !== 'POST' && !req.body.userId) {
          req.body.userId = user.id;
        }
        return okAsync(user);
      })
      .map(() => next());

    if (result.isErr()) {
      const error = result.error;
      res.status(401).json({
        errors: [
          {
            type: EntityType.USER,
            attribute: EntityAttribute.TOKEN,
            message: error.message,
          },
        ],
      });
    }
  };

export default authenticate;
