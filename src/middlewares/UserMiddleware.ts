import { RequestHandler } from 'express';
import { UserUtils } from 'utils/UserUtils';
import { StatusCodes } from 'http-status-codes';
import ErrorHandler from '../helpers/ErrorHandler';
import { EntityAttribute, EntityType } from 'enums/ErrorTypes';
import { CreateUserRequest } from 'interfaces/UserInterface';

/**
 * Middleware for user-related request validation
 * @class UserMiddleware
 */
export default class UserMiddleware {
  private static errorHandler = new ErrorHandler();

  /**
   * Validates user creation request
   * @throws {ErrorHandler} If validation fails
   */
  static validateCreate: RequestHandler = async (req, res, next) => {
    try {
      const { cpf, password, email, telephone } = req.body as CreateUserRequest;

      if (!UserUtils.isValidCPF(cpf)) {
        throw this.errorHandler.addError(
          EntityType.USER,
          EntityAttribute.CPF,
          StatusCodes.BAD_REQUEST,
          'Invalid CPF format',
        );
      }

      if (!UserUtils.isValidPassword(password)) {
        throw this.errorHandler.addError(
          EntityType.USER,
          EntityAttribute.PASSWORD,
          StatusCodes.BAD_REQUEST,
          'Password must be at least 8 characters long',
        );
      }

      if (!UserUtils.isValidEmail(email)) {
        throw this.errorHandler.addError(
          EntityType.USER,
          EntityAttribute.EMAIL,
          StatusCodes.BAD_REQUEST,
          'Invalid email format',
        );
      }

      if (!UserUtils.isValidPhone(telephone)) {
        throw this.errorHandler.addError(
          EntityType.USER,
          EntityAttribute.TELEPHONE,
          StatusCodes.BAD_REQUEST,
          'Invalid phone number format',
        );
      }

      next();
    } catch (error) {
      if (error instanceof ErrorHandler) {
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: error.getErrors() });
      }
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
      });
    }
  };
}
