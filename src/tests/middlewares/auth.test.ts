import jwt from 'jsonwebtoken';
import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import { authenticate } from '../../middlewares/auth';
import { Request, Response } from 'express';

jest.mock('jsonwebtoken');
jest.mock('../../secret', () => ({
  JWT_SECRET: 'test-secret',
}));

describe('Authentication Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      headers: {
        authorization: 'Bearer valid-token',
      },
    };
    mockResponse = {
      status: jest.fn(() => mockResponse as Response).mockReturnThis(),
      json: jest.fn(() => mockResponse as Response).mockReturnThis(),
    };
    nextFunction = jest.fn();
  });

  test('should pass with valid token', async () => {
    (jwt.verify as jest.Mock).mockReturnValue({ userId: '123' });

    await authenticate(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
  });

  test('should fail with invalid token', async () => {
    mockRequest.headers = { authorization: 'Invalid' };

    await authenticate(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith(expect.any(Error));
  });
});
