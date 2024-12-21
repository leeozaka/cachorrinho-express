import { Request, Response, NextFunction } from 'express';
import { compareSync } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { prismaClient } from 'index';
import { JWT_SECRET } from 'secret';
import { StatusCodes } from 'http-status-codes';

export const login = async (req: Request, res: Response) => {
  const { cpf, password } = req.body;
  cpf.replace(/[a-zA-Z^'-.]/gm, '');
  const user = await prismaClient.user.findUnique({
    where: { cpf },
  });

  if (!user || !compareSync(password, user.password)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Invalid CPF and/or password',
    });
  }
  const token = jwt.sign(
    {
      userId: user.id,
    },
    JWT_SECRET,
    { expiresIn: '8h' },
  );
  const { id } = user;
  res.json({ user: id, token });
};
