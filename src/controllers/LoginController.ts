import { Request, Response } from 'express';
import { compareSync } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { prismaClient } from '../index';
import { JWT_SECRET } from '../config/secret';
import { StatusCodes } from 'http-status-codes';
import { LoginRequest, LoginResponse } from '../interfaces/LoginInterface';
import ErrorHandler from '../helpers/ErrorHandler';
import { EntityAttribute, EntityType } from '../enums/ErrorTypes';

/**
 * Controller responsible for handling user authentication
 * @class LoginController
 */
export class LoginController {
  private static errorHandler = new ErrorHandler();

  /**
   * Authenticates a user and generates JWT token
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<Response>} Login response with user id and token
   */
  public static async authenticate(
    req: Request<object, object, LoginRequest>,
    res: Response,
  ): Promise<Response<LoginResponse>> {
    try {
      const { cpf, password } = req.body;

      const cleanCpf = cpf.replace(/\D/g, '');

      const user = await prismaClient.user.findUnique({
        where: { cpf: cleanCpf },
      });

      if (!user || !compareSync(password, user.password)) {
        throw this.errorHandler.addError(
          EntityType.USER,
          EntityAttribute.CREDENTIALS,
          StatusCodes.UNAUTHORIZED,
          'Invalid credentials',
        );
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '8h' });

      return res.status(StatusCodes.OK).json({
        user: user.id,
        token,
      });
    } catch (error) {
      if (error instanceof ErrorHandler) {
        return res.status(error.getErrors()[0].statusCode).json({
          errors: error.getErrors(),
        });
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
      });
    }
  }
}
