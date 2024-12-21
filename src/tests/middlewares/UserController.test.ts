import { UserController } from '../../controllers/UserController';
import { Request, Response, NextFunction, Send } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserService } from '../../services/UserService';
import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { CreateUserRequest } from 'interfaces/UserInterface';
import { ResultAsync } from 'neverthrow';
import { User } from 'dtos/UserDTO';

interface MockResultAsync<T> {
  map: (successCb: (value: T) => T) => {
    map?: (errorCb: (error: Error) => Error) => Error;
    mapErr?: (errorCb: (error: Error) => Error) => Error;
  };
  isErr?: () => boolean;
  error?: Error;
  value?: T;
}

describe('UserController', () => {
  let mockUserService: jest.Mocked<UserService>;
  let controller: UserController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockUserService = {
      create: jest.fn() as jest.MockedFunction<(data: CreateUserRequest) => ResultAsync<User, Error>>,
      findOne: jest.fn() as jest.MockedFunction<(id: string) => ResultAsync<User, Error>>,
      findAll: jest.fn() as jest.MockedFunction<(filter?: Partial<User>) => ResultAsync<User[], Error>>,
      update: jest.fn() as jest.MockedFunction<(id: string, data: Partial<User>) => ResultAsync<User, Error>>,
      delete: jest.fn() as jest.MockedFunction<(id: string) => ResultAsync<boolean, Error>>
    };
    controller = new UserController(mockUserService as UserService);
    req = { body: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis() as jest.MockedFunction<(code: number) => Response>,
      json: jest.fn() as jest.MockedFunction<Response['json']>,
      send: jest.fn() as jest.MockedFunction<Response['send']>,
    };
    next = jest.fn() as unknown as jest.MockedFunction<NextFunction>;
  });

  it('should create a new user', async () => {
    const mockResult: MockResultAsync<User> = {
      map: (successCb) => ({
        map: (errorCb) => successCb({ id: '123', name: 'User' } as User)
      })
    };
    
    mockUserService.create.mockResolvedValue(mockResult as any);
    await controller.create(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.json).toHaveBeenCalledWith({ id: '123', name: 'User' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle error when creating new user', async () => {
    const error = new Error('Creation failed');
    const mockResult: MockResultAsync<User> = {
      map: (successCb) => ({
        map: (errorCb) => errorCb(error),
      })
    };
    mockUserService.create.mockResolvedValue(mockResult as any);
    await controller.create(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('should find a user by ID', async () => {
    req.query = { id: '123' };
    const mockResult: MockResultAsync<User> = {
      map: (successCb) => ({
        mapErr: (errorCb) => successCb({ id: '123', name: 'User' } as User)
      })
    };
    mockUserService.findOne.mockResolvedValue(mockResult as any);
    await controller.findOne(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.json).toHaveBeenCalledWith({ id: '123', name: 'User' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle invalid ID parameter before finding user', async () => {
    req.query = { id: 123 }; // not a string
    await controller.findOne(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledWith(new Error('Invalid ID parameter'));
  });

  it('should find all users', async () => {
    const mockResult: MockResultAsync<User[]> = {
      isErr: () => false,
      value: [{ id: '123' }, { id: '456' }],
    };
    mockUserService.findAll.mockResolvedValue(mockResult as any);
    await controller.findAll(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      isErr: expect.any(Function),
      value: [{ id: '123' }, { id: '456' }],
    });
  });

  it('should return error when findAll fails', async () => {
    const error = new Error('FindAll failed');
    const mockResult: MockResultAsync<User[]> = {
      isErr: () => true,
      error,
    };
    mockUserService.findAll.mockResolvedValue(mockResult as any);
    await controller.findAll(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('should update a user', async () => {
    mockUserService.update.mockResolvedValue({ id: '123', updated: true });
    req.body = { userId: '123', name: 'New Name' };
    await controller.update(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: '123', updated: true });
  });

  it('should handle error during update', async () => {
    const error = new Error('Update failed');
    mockUserService.update.mockRejectedValue(error);
    await controller.update(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('should delete a user', async () => {
    const mockResult: MockResultAsync<null> = {
      map: (successCb) => ({
        mapErr: (errorCb) => successCb(null),
      })
    };
    mockUserService.delete.mockResolvedValue(mockResult as any);
    await controller.delete(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NO_CONTENT);
    expect(res.send).toHaveBeenCalled();
  });

  it('should handle error when deleting user', async () => {
    const error = new Error('Delete failed');
    const mockResult: MockResultAsync<null> = {
      map: (successCb) => ({
        mapErr: (errorCb) => errorCb(error),
      })
    };
    mockUserService.delete.mockResolvedValue(mockResult as any);
    await controller.delete(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledWith(error);
  });
});