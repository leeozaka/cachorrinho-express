import { Request, Response } from 'express';
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

    if (result.isErr()) {
      if (Array.isArray(result.error)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Validation failed', errors: result.error });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: result.error.message });
      }
      return;
    }

    res.status(StatusCodes.CREATED).json(result.value);
  };

  /**
   * Retrieves a single user by ID
   * @param req - Express request with user ID in params or body
   * @param res - Express response object
   */
  findOne = async (req: Request, res: Response): Promise<void> => {
    const id = req.query.id || req.body.id;

    if (typeof id !== 'string') {
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid ID parameter' });
      return;
    }

    const user = await this.userService.findOne(id as string);

    if (user.isErr()) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: user.error.message });
      return;
    }

    res.status(StatusCodes.OK).json(user.value);
  };

  /**
   * Retrieves all users with optional filtering
   * @param req - Express request with optional filter in body
   * @param res - Express response object
   */
  findAll = async (req: Request, res: Response): Promise<void> => {
    const users = await this.userService.findAll(req.body.userId);

    if (users.isErr()) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: users.error.message });
    }

    res.status(StatusCodes.OK).json(users);
  };

  /**
   * Updates an existing user
   * @param req - Express request with user ID and update data in body
   * @param res - Express response object
   */
  update = async (req: Request, res: Response): Promise<void> => {
    const user = await this.userService.update(req.body.id, req.body);

    if (user.isErr()) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: user.error });
      return;
    }

    res.status(StatusCodes.OK).json(user);
  };

  /**
   * Performs a logical deletion of a user
   * @param req - Express request with user ID in body
   * @param res - Express response object
   */
  delete = async (req: Request, res: Response): Promise<void> => {
    const result = await this.userService.delete(req.body.userId);

    if (result.isErr()) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: result.error.message });
      return;
    }

    res.status(StatusCodes.NO_CONTENT).send();
  };
}
