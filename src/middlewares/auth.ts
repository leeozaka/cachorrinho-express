import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { JWT_SECRET } from 'secret';
import UserModel from 'models/UserModel';
import ErrorHandler from 'helpers/ErrorHandler';
import { EntityAttribute, EntityType } from 'enums/ErrorTypes';
import JwtPayload from 'interfaces/JwtPayloadInterface';

/**
 * Authentication middleware to protect routes
 * @throws {ErrorHandler} If token is invalid or user doesn't exist
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const errorHandler = new ErrorHandler();

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw errorHandler.addError(
        EntityType.USER,
        EntityAttribute.TOKEN,
        401,
        'Invalid or missing authentication token',
      );
    }

    const token = authHeader.split(' ')[1];
    if (!JWT_SECRET) {
      throw errorHandler.addError(
        EntityType.USER,
        EntityAttribute.TOKEN,
        500,
        'JWT secret is not configured',
      );
    }
    const decodedToken = jwt.verify(token, JWT_SECRET) as unknown as JwtPayload;

    if (!decodedToken.userId) {
      throw errorHandler.addError(
        EntityType.USER,
        EntityAttribute.TOKEN,
        401,
        'Invalid token payload',
      );
    }

    const userModel = new UserModel();
    const user = await userModel.findOne(decodedToken.userId);

    if (!user) {
      throw errorHandler.addError(EntityType.USER, EntityAttribute.ID, 404, 'User not found');
    }

    // Attach userId to request body if not POST and userId not present
    if (req.method !== 'POST' && !req.body.userId) {
      req.body.userId = decodedToken.userId;
    }

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      errorHandler.addError(EntityType.USER, EntityAttribute.TOKEN, 401, 'Invalid token');
    }

    res.status(errorHandler.getStatus() || 500).json({
      errors: errorHandler.getErrors(),
    });
  }
};

export default authenticate;
