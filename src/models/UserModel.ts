import { PrismaClient, Role } from '@prisma/client';
import { User } from 'dtos/UserDTO';
import { ActivableEntityMixin } from 'interfaces/ActivableEntityInterface';
import * as bcrypt from 'bcrypt';

export const prisma = new PrismaClient();

export default class UserModel {
  isActive: boolean;
  isDeleted: boolean;
  lastModified: Date;
  createdAt: Date;

  constructor() {
    this.isActive = true;
    this.isDeleted = false;
    this.lastModified = new Date();
    this.createdAt = new Date();
  }

  inactivate = ActivableEntityMixin.inactivate;
  logicalDelete = ActivableEntityMixin.logicalDelete;
  activate = ActivableEntityMixin.activate;

  create = async (user: User) => {
    user.password = bcrypt.hashSync(user.password!, 12);
    return await prisma.user.create({
      data: {
        cpf: user.cpf,
        name: user.name,
        email: user.email,
        telephone: user.telephone,
        birthday: user.birthday,
        password: user.password,
        isActive: this.isActive,
        isDeleted: this.isDeleted,
        createdAt: this.createdAt,
        modifiedAt: this.createdAt,
      },
    });
  };

  findAll = async (userId?: number) => {
    return await prisma.user.findMany({
      where: userId ? { id: userId } : undefined,
    });
  };

  findOne = async (userId: number) => {
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  };

  findByCpf = async (cpf: string) => {
    return await prisma.user.findUnique({
      where: { cpf },
    });
  };

  delete = async (userId: number) => {
    const user = await this.findOne(userId);
    this.logicalDelete();

    return await prisma.user.update({
      where: { id: user.id },
      data: {
        ...user,
      },
    });
  };

  update = async (userId: number, user: User) => {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        cpf: user.cpf,
        name: user.name,
        email: user.email,
        telephone: user.telephone,
        birthday: user.birthday,
        password: user.password,
        role: user.role as Role,
      },
    });
  };

  updatePassword = async (userId: number, newPassword: string) => {
    const hashedPassword = bcrypt.hashSync(newPassword, 12);
    return await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  };
}
