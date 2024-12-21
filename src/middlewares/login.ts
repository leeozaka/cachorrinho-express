import { LoginRequest } from './../interfaces/LoginInterface';
import { Request, Response } from 'express';
import { compareSync } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from 'config/secret';
import { StatusCodes } from 'http-status-codes';
import { ResultAsync, errAsync, okAsync } from 'neverthrow';
import { UserService } from 'services/UserService';
import { EntityAttribute, EntityType } from 'enums/ErrorTypes';

export const login =
  (userService: UserService) =>
  async (req: Request, res: Response): Promise<void> => {
    const validateRequest = (data: LoginRequest): ResultAsync<LoginRequest, Error> => {
      if (!data.cpf || !data.password) {
        return errAsync(new Error('Missing required fields'));
      }
      return okAsync({
        cpf: data.cpf.replace(/[a-zA-Z^'-.]/gm, ''),
        password: data.password,
      });
    };

    const validateCredentials = (loginData: LoginRequest) => {
      return userService.findByCpf(loginData.cpf).andThen((user) => {
        if (!user || !compareSync(loginData.password, user.password!)) {
          return errAsync(new Error('Invalid CPF and/or password'));
        }
        return okAsync(user);
      });
    };

    const generateToken = (userId: string): ResultAsync<string, Error> => {
      if (!JWT_SECRET) {
        return errAsync(new Error('JWT secret is not configured'));
      }

      try {
        const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '8h' });
        return okAsync(token);
      } catch (error) {
        return errAsync(new Error('Failed to generate token' + error));
      }
    };

    const result = await validateRequest(req.body)
      .andThen(validateCredentials)
      .andThen((user) => {
        if (!user.id) {
          return errAsync(new Error('User ID is required'));
        }
        return generateToken(user.id).map((token) => ({ userId: user.id, token }));
      });

    result.match(
      (data) => res.status(StatusCodes.OK).json(data),
      (error) =>
        res.status(StatusCodes.BAD_REQUEST).json({
          errors: [
            {
              type: EntityType.USER,
              attribute: EntityAttribute.CREDENTIALS,
              message: error,
            },
          ],
        }),
    );
  };
