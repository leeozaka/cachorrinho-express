import jwt from 'jsonwebtoken';
import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import { authenticate } from '../../middlewares/auth';
import { Request, Response } from 'express';
import { UserService } from '../../services/UserService';

jest.mock('jsonwebtoken');

jest.mock('../../config/secret', () => ({
  JWT_SECRET: 'test-secret'
}));

jest.mock('../../services/UserService');

describe('Authentication Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;
  let mockUserService: jest.Mocked<UserService>;

  beforeEach(() => {
    mockRequest = {
      headers: {
        authorization: 'Bearer valid-token'
      },
      body: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    nextFunction = jest.fn();
    mockUserService = {
      findOne: jest.fn()
    } as unknown as jest.Mocked<UserService>;
  });

  test('should pass with valid token', async () => {
    const mockUser = { id: '123', name: 'Test User' };
    (jwt.verify as jest.Mock).mockReturnValue({ userId: '123' });
    mockUserService.findOne.mockResolvedValue(mockUser);

    await authenticate(mockUserService)(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
  });

  test('should fail with invalid token', async () => {
    mockRequest.headers = { authorization: 'Invalid' };

    await authenticate(mockUserService)(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            message: 'Invalid or missing authentication token'
          })
        ])
      })
    );
  });
});
