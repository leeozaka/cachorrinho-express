import { User } from 'dtos/UserDTO';
import { Request, Response } from 'express';
import UserModel from 'models/UserModel';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from 'secret';
import { compareSync } from 'bcrypt';
import { userUtils } from 'utils/UserUtils';
import { ErrorHandler } from 'helpers/Errors';
import { Field, Table } from 'dtos/ErrorDTO';
import AddressModel from 'models/AddressModel';

const addressModel = new AddressModel();
const userModel = new UserModel();
const errors = new ErrorHandler();

type JwtPayload = {
  userId: number;
};

export default class UserController {
  create = async (req: Request, res: Response) => {
    try {
      const user: User = req.body;
      user.cpf = user.cpf.replace(/[a-zA-Z^'-.]/gm, '');
      const newUser: User = await userModel.create(user);
      res.status(201).json(newUser);
    } catch (e) {
      console.log('Unable to create user', e);
      res.status(500).send({
        error: 'USR-01',
        message: 'Unable to create user',
      });
    }
  };

  findOne = async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const user: User | null = await userModel.findOne(userId);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({
          error: 'USR-06',
          message: 'User not found',
        });
      }
    } catch (e) {
      res.status(500).send({
        error: 'USR-02',
        message: 'Unable to find user',
      });
    }
  };

  findAll = async (req: Request, res: Response) => {
    try {
      const userId: number = req.body.userId;
      const user = await userModel.findOne(userId);

      if (!user) {
        return res.status(404).json({
          error: 'USR-06',
          message: 'User not found',
        });
      }

      const users =
        user.role === 'ADMIN' ? await userModel.findAll() : await userModel.findAll(userId);

      res.status(200).json(users);
    } catch (e) {
      res.status(500).send({
        error: 'USR-03',
        message: 'Unable to fetch users',
      });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const userId: number = req.body.userId;
      const user = await userModel.findOne(userId);

      const updateData: User = req.body;
      if (user) {
        updateData.cpf = user.cpf;
        updateData.birthday = user.birthday;
      }

      const updatedUser = await userModel.update(userId, updateData);
      if (updatedUser) {
        res.status(200).json(updatedUser);
      } else {
        res.status(404).json({
          error: 'USR-06',
          message: 'User not found',
        });
      }
    } catch (e) {
      res.status(500).send({
        error: 'USR-04',
        message: 'Unable to update user',
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const userId = req.body.userId;
      const deletedUser = await userModel.delete(userId);
      if (deletedUser) {
        res.status(204).json(deletedUser);
      }
    } catch (e) {
      res.status(500).send({
        error: 'USR-05',
        message: 'Unable to delete user',
      });
    }
  };

  getProfile = async (req: Request, res: Response) => {
    const userId = req.body.userId;
    const address = await addressModel.findByUser(userId);
    const user = await userModel.findOne(userId);
    const { name, email, telephone, birthday } = user!;

    return res.json({ name, email, telephone, birthday, address });
  };

  changePassword = async (req: Request, res: Response) => {
    try {
      const user = await userModel.findOne(req.body.userId);
      if (!userUtils.isValidPassword(req.body.newPassword)) {
        throw errors.addError(Table.User, Field.Password, 400, 'Invalid password');
      }
      if (!compareSync(req.body.oldPassword, user!.password)) {
        throw errors.addError(Table.User, Field.Password, 400, 'Incorrect old password');
      }

      const updatedUser = await userModel.updatePassword(req.body.userId, req.body.newPassword);

      if (!updatedUser) {
        throw errors.addError(Table.User, Field.Password, 500, 'Password not updated');
      }

      res.status(204).send({
        message: 'Password updated successfully',
      });
    } catch (e) {
      const error = errors.getErrors();
      res.status(400).send({ error });
    }
  };

  forgotPassword = async (req: Request, res: Response) => {
    try {
      const user = await userModel.findByCpf(req.body.cpf);
      if (!user) {
        throw errors.addError(Table.User, Field.Password, 404, 'User not found');
      }
      if (user.email !== req.body.email) {
        throw errors.addError(Table.User, Field.Password, 400, 'Incorrect email');
      }
      if (user.birthday !== req.body.birthday) {
        throw errors.addError(Table.User, Field.Birthday, 400, 'Incorrect birth date');
      }
      if (!userUtils.isValidPassword(req.body.newPassword)) {
        throw errors.addError(Table.User, Field.Password, 400, 'Invalid password');
      }

      const updatedUser = await userModel.updatePassword(user.id, req.body.newPassword);

      if (updatedUser) {
        res.status(200).send({
          message: 'Password successfully reset',
        });
      } else {
        throw errors.addError(Table.User, Field.Password, 500, 'Password not updated');
      }
    } catch (e) {
      const error = errors.getErrors();
      res.status(400).send({ error });
    }
  };
}
