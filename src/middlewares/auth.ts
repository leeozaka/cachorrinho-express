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
  async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const validateToken = (): ResultAsync<string, Error> => {
      const authHeader = req.headers.authorization;

      if (!authHeader?.startsWith('Bearer '))
        return errAsync(new Error('Invalid or missing authentication token'));

      if (!JWT_SECRET) return errAsync(new Error('JWT secret is not configured'));

      return okAsync(authHeader.split(' ')[1]);
    };

    const verifyToken = (token: string): ResultAsync<string, Error> => 
      ResultAsync.fromPromise(
        Promise.resolve(jwt.verify(token, JWT_SECRET as string)),
        (error) => {
          if (error instanceof jwt.JsonWebTokenError) {
            return new Error('Invalid authentication token');
          }
          if (error instanceof jwt.TokenExpiredError) {
            return new Error('Token has expired');
          }
          return new Error('Authentication failed');
        }
      ).andThen((decoded) => {
        const payload = decoded as JwtPayload;
        return payload?.userId 
          ? okAsync(payload.userId)
          : errAsync(new Error('Invalid token payload'));
      });

    const result = await validateToken()
      .andThen(verifyToken)
      .andThen((userId) => userService.findOne(userId))
      .andThen((user) => {
        if (!user) return errAsync(new Error('User not found'));
        if (req.method !== 'POST' && !req.body.userId) req.body.userId = user.id;
        return okAsync(user);
      });

    if (result.isErr()) {
      return res.status(401).json({
        errors: [{
          type: EntityType.USER,
          attribute: EntityAttribute.TOKEN,
          message: result.error.message || 'Authentication failed',
        }],
      });
    }

    return next();
  };

export default authenticate;
