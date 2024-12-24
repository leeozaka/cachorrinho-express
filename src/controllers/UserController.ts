import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserService } from 'services/UserService';

/**
 * Controller handling HTTP requests for User operations
 * Manages user-related endpoints and coordinates with UserService
 */
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Creates a new user
   * @param req - Express request with user data in body
   * @param res - Express response object
   */
  create = async (req: Request, res: Response): Promise<void> => {
    const result = await this.userService.create(req.body);

    result
      .map((user) => {
        res.status(StatusCodes.CREATED).json(user);
      })
      .mapErr((error) => {
        if (Array.isArray(error)) {
          res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Validation failed',
            errors: error,
          });
        } else {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message,
          });
        }
      });
  };

  /**
   * Retrieves a single user by ID
   * @param req - Express request with user ID in params
   * @param res - Express response object
   * @param next - Express next function for error handling
   */
  findOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id = req.query.id || req.body.userId;
    if (typeof id !== 'string') {
      next(new Error('Invalid ID parameter'));
      return;
    }

    console.log(id);

    const user = await this.userService.findOne(id as string);

    user
      .map((responseData) => {
        res.status(StatusCodes.OK).json(responseData);
      })
      .mapErr((errorInstance) => {
        next(errorInstance);
      });
  };

  /**
   * Retrieves all users with optional filtering
   * @param req - Express request with optional filter in body
   * @param res - Express response object
   * @param next - Express next function for error handling
   */
  findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const users = await this.userService.findAll(req.body.userId);

    if (users.isErr()) {
      next(users.error);
    } else {
      res.status(200).json(users);
    }
  };

  /**
   * Updates an existing user
   * @param req - Express request with user ID and update data in body
   * @param res - Express response object
   * @param next - Express next function for error handling
   */
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userService.update(req.body.userId, req.body);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Performs a logical deletion of a user
   * @param req - Express request with user ID in body
   * @param res - Express response object
   * @param next - Express next function for error handling
   */
  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const result = await this.userService.delete(req.body.userId);

    result
      .map(() => {
        res.status(StatusCodes.NO_CONTENT).send();
      })
      .mapErr((error) => {
        next(error);
      });
  };

  // getProfile = async (req: Request, res: Response) => {
  //   const userId = req.body.userId;
  //   const address = await addressModel.findByUser(userId);
  //   const user = await this.userService.findOne(userId);
  //   const { name, email, telephone, birthday } = user!;

  //   return res.json({ name, email, telephone, birthday, address });
  // };

  // changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  //   try {
  //     await this.userService.changePassword(
  //       req.body.userId,
  //       req.body.oldPassword,
  //       req.body.newPassword,
  //     );
  //     res.status(204).send();
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // forgotPassword = async (req: Request, res: Response) => {
  //   try {
  //     const user = await this.userService.findByCpf(req.body.cpf);
  //     if (!user) {
  //       throw errors.addError(Table.User, Field.Password, 404, 'User not found');
  //     }
  //     if (user.email !== req.body.email) {
  //       throw errors.addError(Table.User, Field.Password, 400, 'Incorrect email');
  //     }
  //     if (user.birthday !== req.body.birthday) {
  //       throw errors.addError(Table.User, Field.Birthday, 400, 'Incorrect birth date');
  //     }
  //     if (!userUtils.isValidPassword(req.body.newPassword)) {
  //       throw errors.addError(Table.User, Field.Password, 400, 'Invalid password');
  //     }

  //     const updatedUser = await this.userService.updatePassword(user.id, req.body.newPassword);

  //     if (updatedUser) {
  //       res.status(200).send({
  //         message: 'Password successfully reset',
  //       });
  //     } else {
  //       throw errors.addError(Table.User, Field.Password, 500, 'Password not updated');
  //     }
  //   } catch (e) {
  //     const error = errors.getErrors();
  //     res.status(400).send({ error });
  //   }
  // };
}
